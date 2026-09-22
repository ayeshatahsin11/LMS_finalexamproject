"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";

// Fetches the admin-managed, active category list once per component.
// Shared by the homepage showcase, the course-listing filter dropdown,
// and the instructor's create/edit course forms, so all four stay in
// sync with whatever an admin has configured under /admin/categories.
export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/categories")
      .then((res) => setCategories(res.data.categories || []))
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, []);

  return { categories, loading };
}