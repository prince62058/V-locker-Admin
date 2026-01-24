import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// const BASE_URL = import.meta.env.VITE_APP_BASE_URL + '/api/';
const BASE_URL = 'http://localhost:3000/api/';

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
  tagTypes: [
    'userProfile',
    'users',
    'customers',
    'customer-loans',
    'loan',
    'brand',
    'model',
    'state',
    'city',
    'feedback',
    'video',
    'company',
  ],
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
    userDetail: builder.query({
      query: ({ userId }) => ({
        url: `user/${userId}`,
      }),
    }),
    userDisable: builder.mutation({
      query: (userId) => ({
        url: `user/disable/${userId}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['users'],
    }),

    // customers
    getAllCustomers: builder.query({
      query: ({ type, search, page, status }) =>
        `customers?userType=${type}&search=${search}&isDisabled=${status}&page=${page}&limit=20`,
      providesTags: ['customers'],
    }),
    customerDetail: builder.query({
      query: ({ customerId }) => ({
        url: `customers/${customerId}`,
      }),
    }),

    // Feedback
    getAllFeedback: builder.query({
      query: ({ search, page }) => ({
        url: `feedback?page=${page}&search=${search}&limit=20`,
      }),
      providesTags: ['feedback'],
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

    updateDevicePolicy: builder.mutation({
      query: ({ loanId, data }) => ({
        url: `customerLoan/policy/${loanId}`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['customer-loans'],
    }),

    lockDeviceBulk: builder.mutation({
      query: (loanIds) => ({
        url: `customerLoan/bulk/lock`,
        method: 'POST',
        body: { loanIds },
      }),
      invalidatesTags: ['customer-loans'],
    }),

    unlockDeviceBulk: builder.mutation({
      query: (loanIds) => ({
        url: `customerLoan/bulk/unlock`,
        method: 'POST',
        body: { loanIds },
      }),
      invalidatesTags: ['customer-loans'],
    }),

    updateDevicePolicyBulk: builder.mutation({
      query: ({ loanIds, data }) => ({
        url: `customerLoan/bulk/policy`,
        method: 'POST',
        body: { loanIds, policy: data },
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

    // Insatallation Video
    getAllInstallationVideo: builder.query({
      query: ({ search, page }) => ({
        url: `upload?page=${page}&search=${search}&limit=20`,
      }),
      providesTags: ['video'],
    }),
    createInstallationVideo: builder.mutation({
      query: ({ data }) => ({
        url: `upload/upload-video`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['video'],
    }),
    updateInstallatioVideo: builder.mutation({
      query: ({ data, videoId }) => ({
        url: `upload/${videoId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['video'],
    }),
    deleteInstallactionVideo: builder.mutation({
      query: ({ data, videoId }) => ({
        url: `upload/${videoId}`,
        method: 'DELETE',
        body: data,
      }),
      invalidatesTags: ['video'],
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
  }),
});

export const {
  useGetDashboardGraphsQuery,
  useGetAllUsersQuery,
  useGetAllCustomersQuery,
  useGetAllSubAdminQuery,
  useCreateNotificationForAllUserMutation,
  useCreateNotificationForSingleUserMutation,
  useUserLoginMutation,
  useUserProfileQuery,
  useUpdateProfileMutation,
  useUserDisableMutation,
  useDisableAdminMutation,
  useCreateSubAdminMutation,
  useGetMobileAdminsQuery,
  useCreateMobileAdminMutation,
  useDeleteMobileAdminMutation,
  useUpdateSubAdminMutation,
  useGetBannerQuery,
  useUpdateBannerMutation,
  useGetTodayLeadboardQuery,
  useGetAllLeadboardQuery,
  useCreateLeadboardMutation,
  useUpdateLeadboardMutation,
  useGetCompanyQuery,
  useUpdateCompanyMutation,
  useGetAllCustomerLoanQuery,
  useUpdateCustomerLoanMutation,
  useLockDeviceMutation,
  useUnlockDeviceMutation,
  useUpdateDevicePolicyMutation,
  useLockDeviceBulkMutation,
  useUnlockDeviceBulkMutation,
  useUpdateDevicePolicyBulkMutation,
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
  useUpdateCityMutation,
  useDeleteCityMutation,
  useGetAllFeedbackQuery,
  useGetAllInstallationVideoQuery,
  useCreateInstallationVideoMutation,
  useUpdateInstallatioVideoMutation,
  useDeleteInstallactionVideoMutation,
  useUserDetailQuery,
  useCustomerDetailQuery,
} = api;
