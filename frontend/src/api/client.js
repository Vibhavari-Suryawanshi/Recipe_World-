import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
});

export const searchRecipes = (query, cuisine) =>
  api.get("/api/recipes/search", { params: { query, cuisine } }).then((r) => r.data);

export const getRecipe = (id) =>
  api.get(`/api/recipes/${id}`).then((r) => r.data);

export const findByIngredients = (ingredients) =>
  api.post("/api/recipes/by-ingredients", { ingredients }).then((r) => r.data);

export const aiSuggest = (ingredients, cuisine) =>
  api.post("/api/ai/suggest", { ingredients, cuisine }).then((r) => r.data);

export const aiTranslate = (title, ingredients, steps, target_lang) =>
  api
    .post("/api/ai/translate", { title, ingredients, steps, target_lang })
    .then((r) => r.data);

export default api;
