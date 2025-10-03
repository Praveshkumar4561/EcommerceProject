import { useEffect, useState } from "react";
import axios from "axios";

export default function useActiveTheme() {
  const [themeFolder, setThemeFolder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    axios
      .get("https://demo.webriefly.com/api/themes/active")
      .then((res) => {
        if (!mounted) return;
        const folder = res.data?.theme?.folder_name || null;
        setThemeFolder(folder);
        setLoading(false);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err);
        setThemeFolder(null);
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return { themeFolder, loading, error };
}
