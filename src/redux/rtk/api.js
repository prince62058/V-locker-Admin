import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = `${import.meta.env.VITE_APP_API}`;

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    // baseUrl: '/api',
    prepareHeaders: (headers) => {
      // Retrieve token directly from sessionStorage
      const userToken = JSON.parse(sessionStorage.getItem('jwt_access_token'));
      const token = userToken?.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['userProfile', 'users', 'loan', 'brand', 'model', 'state', 'city', 'company'],
  endpoints: (builder) => ({
    // Define your CRUD endpoints here

    // ---------------------------------------------- Dashboard -----------------------------------------------
    getDashboardGraphs: builder.query({
      query: ({ year }) => `home/all?year=${year}`,
      providesTags: ['DashboardGraph'],
    }),

    // admin
    userLogin: builder.mutation({
      query: ({ data }) => ({
        url: `auth/login`,
        method: 'POST',
        body: data,
      }),
    }),
    userProfile: builder.query({
      query: () => {
        const userToken = JSON.parse(sessionStorage.getItem('jwt_access_token'));
        return `user/${userToken?.id}`;
      },
      providesTags: ['userProfile'],
    }),
    updateProfile: builder.mutation({
      query: ({ data }) => ({
        url: `user`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['userProfile'],
    }),

    // users
    getAllUsers: builder.query({
      query: ({ type, search, page, status }) =>
        `user?userType=${type}&search=${search}&isDisabled=${status}&page=${page}&limit=20`,
      providesTags: ['users'],
    }),
    userDisable: builder.mutation({
      query: (userId) => ({
        url: `user/disable/${userId}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['users'],
    }),

    // company
    getCompany: builder.query({
      query: () => `company`,
      providesTags: ['company'],
    }),
    updateCompany: builder.mutation({
      query: ({ data }) => ({
        url: `company`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['company'],
    }),

    // Loan Request
    // Customer Loan Management
    getAllCustomerLoan: builder.query({
      query: ({ page, status, search }) => ({
        url: `customerLoan?page=${page}&limit=20&loanStatus=${status || ''}&search=${search || ''}`,
      }),
      providesTags: ['customer-loans'],
    }),

    updateCustomerLoan: builder.mutation({
      query: ({ loanId, data }) => ({
        url: `customerLoan/${loanId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['customer-loans', 'loan'],
    }),

    lockDevice: builder.mutation({
      query: (loanId) => ({
        url: `customerLoan/lock/${loanId}`,
        method: 'POST',
      }),
      invalidatesTags: ['customer-loans'],
    }),

    unlockDevice: builder.mutation({
      query: (loanId) => ({
        url: `customerLoan/unlock/${loanId}`,
        method: 'POST',
      }),
      invalidatesTags: ['customer-loans'],
    }),

    getAllLoan: builder.query({
      query: ({ status, search, page }) => ({
        url: `keys/allKeys?page=${page}&limit=20&status=${status}&search=${search}`,
      }),
      providesTags: ['loan'],
    }),
    updateLoanStatus: builder.mutation({
      query: ({ data, loanId }) => ({
        url: `keys/${loanId}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['loan'],
    }),

    // Notification
    sendNotificationSingleAndAllUser: builder.mutation({
      query: ({ data }) => ({
        url: `notification`,
        method: 'POST',
        body: data,
      }),
    }),

    // Brand
    getAllBrand: builder.query({
      query: ({ search, page }) => ({
        url: `mobile-brands?page=${page}&search=${search}&limit=20`,
      }),
      providesTags: ['brand'],
    }),
    createBrand: builder.mutation({
      query: ({ data }) => ({
        url: `mobile-brands`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['brand'],
    }),
    updateBrand: builder.mutation({
      query: ({ data, brandId }) => ({
        url: `mobile-brands/${brandId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['brand'],
    }),
    deleteBrand: builder.mutation({
      query: ({ data, brandId }) => ({
        url: `mobile-brands/${brandId}`,
        method: 'DELETE',
        body: data,
      }),
      invalidatesTags: ['brand'],
    }),

    // Model
    getAllModel: builder.query({
      query: ({ search, page }) => ({
        url: `mobile-models?page=${page}&search=${search}&limit=20`,
      }),
      providesTags: ['model'],
    }),
    createModel: builder.mutation({
      query: ({ data }) => ({
        url: `mobile-models`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['model'],
    }),
    updateModel: builder.mutation({
      query: ({ data, modelId }) => ({
        url: `mobile-models/${modelId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['model'],
    }),
    deleteModel: builder.mutation({
      query: ({ data, modelId }) => ({
        url: `mobile-models/${modelId}`,
        method: 'DELETE',
        body: data,
      }),
      invalidatesTags: ['model'],
    }),

    // State
    getAllState: builder.query({
      query: ({ search, page }) => ({
        url: `states?page=${page}&search=${search}&limit=20`,
      }),
      providesTags: ['state'],
    }),
    createState: builder.mutation({
      query: ({ data }) => ({
        url: `states`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['state'],
    }),
    updateState: builder.mutation({
      query: ({ data, stateId }) => ({
        url: `states/${stateId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['state'],
    }),
    deleteState: builder.mutation({
      query: ({ data, stateId }) => ({
        url: `states/${stateId}`,
        method: 'DELETE',
        body: data,
      }),
      invalidatesTags: ['state'],
    }),

    // City
    getAllCity: builder.query({
      query: ({ stateId, page, search }) => ({
        url: `cities/state/${stateId}?page=${page}&search=${search}&limit=20`,
      }),
      providesTags: ['city'],
    }),
    createCity: builder.mutation({
      query: ({ data }) => ({
        url: `cities`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['city'],
    }),
    updateCity: builder.mutation({
      query: ({ data, cityId }) => ({
        url: `cities/${cityId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['city'],
    }),
    deleteCity: builder.mutation({
      query: ({ data, cityId }) => ({
        url: `cities/${cityId}`,
        method: 'DELETE',
        body: data,
      }),
      invalidatesTags: ['city'],
    }),

    // ----------------------------------------------- sub admin ----------------------------------------------
    getAllSubAdmin: builder.query({
      query: ({ type, search, page, status }) =>
        `admin/getAllUsers?userType=${type}&search=${search}&disable=${status}&page=${page}`,
      providesTags: ['subAdmin'],
    }),
    getMobileAdmins: builder.query({
      query: ({ search, page }) => `user?role=admin&search=${search || ''}&page=${page}`,
      providesTags: ['subAdmin'],
    }),
    createSubAdmin: builder.mutation({
      query: ({ data }) => ({
        url: `admin/createSubAdmin`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['subAdmin'],
    }),
    createMobileAdmin: builder.mutation({
      query: ({ data }) => ({
        url: `user/admin`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['subAdmin'],
    }),
    updateSubAdmin: builder.mutation({
      query: ({ data }) => ({
        url: `admin/updatePassword`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['subAdmin'],
    }),
    disableAdmin: builder.mutation({
      query: ({ userId }) => ({
        url: `admin/disableUser?userId=${userId}`,
        method: 'PUT',
      }),
      invalidatesTags: ['subAdmin'],
    }),
    deleteMobileAdmin: builder.mutation({
      query: (userId) => ({
        url: `user/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['subAdmin'],
    }),

    // ------------------------------------------------------ Banner ------------------------------------------------
    getBanner: builder.query({
      query: () => `admin/getBanner`,
      providesTags: ['banner'],
    }),
    updateBanner: builder.mutation({
      query: ({ data }) => ({
        url: `admin/updateBanner`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['banner'],
    }),

    // -------------------------------------------- QR Code -------------------------------------------
    getQrCode: builder.query({
      query: () => `admin/getUpiBarcode`,
      providesTags: ['qrCode'],
    }),
    updateQrCode: builder.mutation({
      query: ({ data }) => ({
        url: `admin/updateUpiBarcode`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['qrCode'],
    }),

    // -------------------------------------------- App Info -------------------------------------------
    getAppInfo: builder.query({
      query: () => `admin/appInfo`,
      providesTags: ['appInfo'],
    }),
    updateAppInfo: builder.mutation({
      query: ({ data }) => ({
        url: `admin/updateAppinfo`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['appInfo'],
    }),

    // -------------------------------------------- how to play -------------------------------------------
    getHowtoplay: builder.query({
      query: () => `admin/getHowToPlay`,
      providesTags: ['howtoplay'],
    }),
    updateHowroplay: builder.mutation({
      query: ({ data }) => ({
        url: `admin/howToPlay`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['howtoplay'],
    }),

    // -------------------------------------------- leadboard -------------------------------------------
    getTodayLeadboard: builder.query({
      query: () => `admin/getLeaderboardEntry?filter=today`,
      providesTags: ['todayleadboard'],
    }),
    getAllLeadboard: builder.query({
      query: ({ status }) => `admin/getLeaderboard?filter=${status}`,
      providesTags: ['leadboard'],
    }),
    createLeadboard: builder.mutation({
      query: ({ data }) => ({
        url: `admin/createLeaderboardEntry`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['todayleadboard', 'leadboard'],
    }),
    updateLeadboard: builder.mutation({
      query: ({ data }) => ({
        url: `admin/updateLeaderboard`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['leadboard'],
    }),

    // -------------------------------------------------------- game -----------------------------------------------------
    getAllGames: builder.query({
      query: ({ status, search, page }) => ({
        url: `admin/getAllGames?disable=${status}&search=${search}&page=${page}`,
      }),
      providesTags: ['game'],
    }),
    getGameDetails: builder.query({
      query: ({ gameId }) => ({
        url: `admin/getGameById?gameId=${gameId}`,
      }),
      providesTags: ['game'],
    }),
    createGame: builder.mutation({
      query: ({ data }) => ({
        url: `admin/createGame`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['game'],
    }),
    updateGame: builder.mutation({
      query: ({ gameId, data }) => ({
        url: `admin/updateGame?gameId=${gameId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['game'],
    }),
    disableGame: builder.mutation({
      query: ({ gameId }) => ({
        url: `admin/disableGame?gameId=${gameId}`,
        method: 'PUT',
      }),
      invalidatesTags: ['game'],
    }),

    // -------------------------------------------------------- betting game -----------------------------------------------------
    getAllBettingGames: builder.query({
      query: ({ gameType, status, sDate, page }) => ({
        url: `admin/adminGetBattingGameList?gameType=${gameType}&filter=${status}&startDate=${sDate}&page=${page}`,
      }),
      providesTags: ['bettingGame'],
    }),
    getBettingGameDetails: builder.query({
      query: ({ gameId }) => ({
        url: `admin/adminGetGameById?gameId=${gameId}`,
      }),
      providesTags: ['bettingGameDetails'],
    }),

    // -------------------------------------------------------- game rule-----------------------------------------------------
    getAllGamesRules: builder.query({
      query: () => ({
        url: `admin/getGameBet`,
      }),
      providesTags: ['gameRule'],
    }),
    updateGameRules: builder.mutation({
      query: ({ data }) => ({
        url: `admin/updateGameBet`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['gameRule'],
    }),

    // ------------------------------------------------------------ Game result -----------------------------------
    getAllGameResult: builder.query({
      query: ({ status, sDate, page }) => ({
        url: `admin/results?filter=${status}&startDate=${sDate}&page=${page}`,
      }),
      providesTags: ['gameResult'],
    }),
    createGameResult: builder.mutation({
      query: ({ data }) => ({
        url: `admin/results`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['gameResult'],
    }),

    // --------------------------------------------------------Notification -----------------------------------
    createNotificationForAllUser: builder.mutation({
      query: ({ data }) => ({
        url: `admin/sendNofitionToAllUser`,
        method: 'POST',
        body: data,
      }),
    }),
    createNotificationForSingleUser: builder.mutation({
      query: ({ data }) => ({
        url: `admin/sendNotificationToUser`,
        method: 'POST',
        body: data,
      }),
    }),

    // ------------------------------------------------------------ Transaction -----------------------------------
    getAllTransaction: builder.query({
      query: ({ status, search, page }) => ({
        url: `admin/getTranstionList?status=${status}&search=${search}&page=${page}`,
      }),
      providesTags: ['transaction'],
    }),
    updateTransactionStatus: builder.mutation({
      query: ({ data }) => ({
        url: `admin/updateTranstionStatus`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['transaction'],
    }),

    // ------------------------------------------------------------ Withdraw -----------------------------------
    getAllWithdraw: builder.query({
      query: ({ status, search, page }) => ({
        url: `admin/getListWithdraw?search=${search}&status=${status}&page=${page}`,
      }),
      providesTags: ['withdraw'],
    }),
    updateWithdrawStatus: builder.mutation({
      query: ({ data }) => ({
        url: `admin/updateWithdrawStatus`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['withdraw'],
    }),

    // --------------------------------------------------------- Chat ----------------------------------------------------------
    getAllThread: builder.query({
      query: ({ search, page }) => ({
        url: `admin/getAllThreadByAdmin?search=${search}&page=${page}`,
      }),
      providesTags: ['thread'],
    }),
    getAllMessage: builder.query({
      query: ({ threadId, page }) => ({
        url: `admin/getChatByThreadId?threadId=${threadId}&page=${page}`,
      }),
      providesTags: ['message'],
    }),
  }),
});

export const {
  useGetDashboardGraphsQuery,
  useGetAllUsersQuery,
  useGetAllSubAdminQuery,
  useGetMobileAdminsQuery,
  useGetAllGamesQuery,
  useGetGameDetailsQuery,
  useCreateGameMutation,
  useUpdateGameMutation,
  useDisableGameMutation,
  useGetAllGamesRulesQuery,
  useUpdateGameRulesMutation,
  useCreateNotificationForAllUserMutation,
  useCreateNotificationForSingleUserMutation,
  useUserLoginMutation,
  useUserProfileQuery,
  useUpdateProfileMutation,
  useUserDisableMutation,
  useDisableAdminMutation,
  useCreateSubAdminMutation,
  useCreateMobileAdminMutation,
  useDeleteMobileAdminMutation,
  useUpdateSubAdminMutation,
  useGetBannerQuery,
  useUpdateBannerMutation,
  useGetQrCodeQuery,
  useUpdateQrCodeMutation,
  useGetAppInfoQuery,
  useUpdateAppInfoMutation,
  useGetHowtoplayQuery,
  useUpdateHowroplayMutation,
  useGetAllTransactionQuery,
  useUpdateTransactionStatusMutation,
  useGetAllWithdrawQuery,
  useUpdateWithdrawStatusMutation,
  useGetTodayLeadboardQuery,
  useGetAllLeadboardQuery,
  useCreateLeadboardMutation,
  useUpdateLeadboardMutation,
  useGetCompanyQuery,
  useUpdateCompanyMutation,
  useGetAllThreadQuery,
  useGetAllMessageQuery,
  useGetAllBettingGamesQuery,
  useGetBettingGameDetailsQuery,
  useGetAllGameResultQuery,
  useCreateGameResultMutation,
  useGetAllLoanQuery,
  useUpdateLoanStatusMutation,
  useSendNotificationSingleAndAllUserMutation,
  useGetAllBrandQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
  useGetAllModelQuery,
  useCreateModelMutation,
  useUpdateModelMutation,
  useDeleteModelMutation,
  useGetAllStateQuery,
  useCreateStateMutation,
  useUpdateStateMutation,
  useDeleteStateMutation,
  useGetAllCityQuery,
  useCreateCityMutation,
  useGetAllCustomerLoanQuery,
  useUpdateCustomerLoanMutation,
  useLockDeviceMutation,
  useUnlockDeviceMutation,
  useUpdateCityMutation,
  useDeleteCityMutation,
} = api;
