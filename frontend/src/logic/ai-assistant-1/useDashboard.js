import { useEffect, useState } from "react";
import { loadDashboardData } from "./dashboardService";
import { useRole } from "../../context/RoleContext";

export const useDashboard = () => {
  const { activeRole } = useRole();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const syncWorkspaceData = async () => {
      setLoading(true);

      const safeKey = activeRole ? activeRole.toLowerCase().trim() : "farmer";
      const result = await loadDashboardData(safeKey);

      if (isMounted) {
        setData(result);
        setLoading(false);
      }
    };

    syncWorkspaceData();

    return () => {
      isMounted = false;
    };
  }, [activeRole]);

  return {
    dashboardData: data,
    loading,
  };
};
