import { createApi } from "@reduxjs/toolkit/query/react";
import { tagTypeList } from "../tag-types";
import { axiosBaseQuery } from "../../helpers/axios/axiosBaseQuery";
import { getBaseUrl } from "../../helpers/config/envConfig";

export const baseApi = createApi({
  reducerPath: "api",
  //  returning url - http://localhost:backend/api/v1
  baseQuery: axiosBaseQuery({ baseUrl: getBaseUrl() }),
  endpoints: () => ({}),
  tagTypes: tagTypeList,
});
