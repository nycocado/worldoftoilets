import { apiClient } from './client';
import type {
  PaginatedResponse,
  UserFilters,
  UpdateUserDto,
  EstablishmentFilters,
  Establishment,
  PartnerApplication,
  PartnerApplicationFilters,
  ReviewPartnerApplicationDto,
  Report,
  ReportFilters,
  ResolveReportDto,
  Comment,
  CommentFilters,
  UpdateCommentDto,
} from '@/types/admin';
import type { User } from '@/types/auth';

class ApiError extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string | object) {
    super(typeof message === 'object' ? JSON.stringify(message) : message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
  }
}

// User Management
export async function getUsers(
  filters: {
    page?: number;
    size?: number;
    search?: string;
    includeDeactivated?: boolean;
  } = {},
) {
  const params = new URLSearchParams();
  if (filters.page !== undefined)
    params.append('page', filters.page.toString());
  if (filters.size) params.append('size', filters.size.toString());
  if (filters.search) params.append('search', filters.search);
  if (filters.includeDeactivated) params.append('includeDeactivated', 'true');

  const query = params.toString() ? `?${params.toString()}` : '';
  return apiClient<PaginatedResponse<User>>(`/user/manage${query}`);
}

export async function updateUser(userId: string, data: UpdateUserDto) {
  return apiClient<User>(`/user/${userId}/manage`, {
    method: 'PATCH', // Swagger says PATCH for update
    body: JSON.stringify(data),
  });
}

export async function deleteUser(userId: string) {
  return apiClient<{ message: string }>(`/user/${userId}/manage`, {
    method: 'DELETE',
  });
}

export async function undeleteUser(userId: string) {
  return apiClient<{ message: string; data: User }>(
    `/user/${userId}/manage/undelete`,
    {
      method: 'PUT',
    },
  );
}

export async function assignRoles(userId: string, roles: string[]) {
  return apiClient<User>(`/user/${userId}/manage/roles`, {
    method: 'PUT',
    body: JSON.stringify({ roles }),
  });
}

export async function removeRoles(userId: string, roles: string[]) {
  return apiClient<User>(`/user/${userId}/manage/roles`, {
    method: 'DELETE',
    body: JSON.stringify({ roles }),
  });
}

// Establishment Management
export async function getEstablishments(filters: EstablishmentFilters = {}) {
  const params = new URLSearchParams();
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());
  if (filters.search) params.append('search', filters.search);
  if (filters.minRating)
    params.append('minRating', filters.minRating.toString());
  if (filters.maxRating)
    params.append('maxRating', filters.maxRating.toString());

  const query = params.toString() ? `?${params.toString()}` : '';
  return apiClient<PaginatedResponse<Establishment>>(
    `/admin/establishments${query}`,
  );
}

export async function deleteEstablishment(establishmentId: string) {
  return apiClient<{ message: string }>(
    `/admin/establishments/${establishmentId}`,
    {
      method: 'DELETE',
    },
  );
}

// Partner Applications
export async function getPartnerApplications(
  filters: PartnerApplicationFilters = {},
) {
  const params = new URLSearchParams();
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());
  if (filters.search) params.append('search', filters.search);
  if (filters.status?.length) {
    filters.status.forEach((status) => params.append('status', status));
  }

  const query = params.toString() ? `?${params.toString()}` : '';
  return apiClient<PaginatedResponse<PartnerApplication>>(
    `/admin/partner-applications${query}`,
  );
}

export async function reviewPartnerApplication(
  applicationId: string,
  data: ReviewPartnerApplicationDto,
) {
  return apiClient<PartnerApplication>(
    `/admin/partner-applications/${applicationId}/review`,
    {
      method: 'PATCH',
      body: JSON.stringify(data),
    },
  );
}

// User Reports Management
export async function getUserReports(
  filters: { page?: number; limit?: number; status?: string } = {},
) {
  const params = new URLSearchParams();
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());
  if (filters.status) params.append('status', filters.status);

  const query = params.toString() ? `?${params.toString()}` : '';
  return apiClient<any>(`/report-user/manage${query}`); // Use 'any' or specific type if imported
}

export async function getUserReportDetails(userPublicId: string) {
  return apiClient<any>(`/report-user/manage/${userPublicId}`);
}

export async function acceptUserReport(reportId: string) {
  return apiClient<{ message: string }>(
    `/report-user/manage/${reportId}/accept`,
    {
      method: 'PATCH',
    },
  );
}

export async function acceptUserReports(userPublicId: string) {
  return apiClient<{ message: string }>(
    `/report-user/manage/${userPublicId}/accept`,
    {
      method: 'PATCH',
    },
  );
}

// Toilet Reports Management
export async function getToiletReports(
  filters: { page?: number; limit?: number; status?: string } = {},
) {
  const params = new URLSearchParams();
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());
  if (filters.status) params.append('status', filters.status);

  const query = params.toString() ? `?${params.toString()}` : '';
  return apiClient<any>(`/report-toilet/manage${query}`);
}

export async function getToiletReportDetails(toiletPublicId: string) {
  return apiClient<any>(`/report-toilet/manage/${toiletPublicId}`);
}

export async function acceptToiletReport(reportId: string) {
  return apiClient<{ message: string }>(
    `/report-toilet/manage/${reportId}/accept`,
    {
      method: 'PATCH',
    },
  );
}

export async function rejectToiletReport(reportId: string) {
  return apiClient<{ message: string }>(
    `/report-toilet/manage/${reportId}/reject`,
    {
      method: 'PATCH',
    },
  );
}

export async function setToiletReportsPending(toiletPublicId: string) {
  return apiClient<{ message: string }>(
    `/report-toilet/manage/${toiletPublicId}/pending`,
    {
      method: 'PATCH',
    },
  );
}

export async function rejectUserReport(reportId: string) {
  return apiClient<{ message: string }>(
    `/report-user/manage/${reportId}/reject`,
    {
      method: 'PATCH',
    },
  );
}

export async function setUserReportsPending(userPublicId: string) {
  return apiClient<{ message: string }>(
    `/report-user/manage/${userPublicId}/pending`,
    {
      method: 'PATCH',
    },
  );
}

// Comments Management
export async function getComments(filters: CommentFilters = {}) {
  const params = new URLSearchParams();
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());
  if (filters.search) params.append('search', filters.search);
  if (filters.establishmentId)
    params.append('establishmentId', filters.establishmentId);
  if (filters.authorId) params.append('authorId', filters.authorId);

  const query = params.toString() ? `?${params.toString()}` : '';
  return apiClient<PaginatedResponse<Comment>>(`/admin/comments${query}`);
}

export async function updateComment(commentId: string, data: UpdateCommentDto) {
  return apiClient<Comment>(`/admin/comments/${commentId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteComment(commentId: string) {
  return apiClient<{ message: string }>(`/admin/comments/${commentId}`, {
    method: 'DELETE',
  });
}

export async function deleteReply(replyId: string) {
  return apiClient<{ message: string }>(`/admin/replies/${replyId}`, {
    method: 'DELETE',
  });
}

// Suggestions Management
export async function getSuggestions(
  filters: { page?: number; limit?: number; status?: string } = {},
) {
  const params = new URLSearchParams();
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());
  if (filters.status) params.append('status', filters.status);

  const query = params.toString() ? `?${params.toString()}` : '';
  return apiClient<any>(`/suggestion/manage${query}`);
}

export async function approveSuggestion(id: string) {
  return apiClient<{ message: string }>(`/suggestion/${id}/manage/accept`, {
    method: 'PUT',
  });
}

export async function rejectSuggestion(id: string) {
  return apiClient<{ message: string }>(`/suggestion/${id}/manage/reject`, {
    method: 'PUT',
  });
}

export async function setSuggestionPending(id: string) {
  return apiClient<{ message: string }>(`/suggestion/${id}/manage/pending`, {
    method: 'PUT',
  });
}

export async function getSuggestionDetails(id: string) {
  return apiClient<any>(`/suggestion/${id}/manage`);
}

export async function updateToilet(id: string, data: any) {
  return apiClient<any>(`/toilet/${id}/manage`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function publishSuggestionImage(id: string) {
  return apiClient<{ message: string }>(
    `/suggestion/${id}/manage/image/publish`,
    {
      method: 'POST',
    },
  );
}

export async function uploadToiletImage(id: string, file: File) {
  const formData = new FormData();
  formData.append('image', file);

  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/toilet/${id}/manage/image`,
    {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    },
  );

  if (!response.ok) {
    let errorData;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      errorData = await response.json();
    } else {
      errorData = await response.text();
    }
    throw new ApiError(response.status, errorData || response.statusText);
  }

  return response.json(); // Assuming success returns JSON { url: string }
}

// Comment Reports Management
export async function getCommentReports(
  filters: { page?: number; limit?: number; status?: string } = {},
) {
  const params = new URLSearchParams();
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());
  if (filters.status) params.append('status', filters.status);

  const query = params.toString() ? `?${params.toString()}` : '';
  return apiClient<any>(`/report-comment/manage${query}`);
}

export async function getCommentReportDetails(commentPublicId: string) {
  return apiClient<any>(`/report-comment/manage/${commentPublicId}`);
}

export async function acceptCommentReport(reportId: string) {
  return apiClient<{ message: string }>(
    `/report-comment/manage/${reportId}/accept`,
    {
      method: 'PATCH',
    },
  );
}

export async function rejectCommentReport(reportId: string) {
  return apiClient<{ message: string }>(
    `/report-comment/manage/${reportId}/reject`,
    {
      method: 'PATCH',
    },
  );
}

export async function setCommentReportPending(reportId: string) {
  return apiClient<{ message: string }>(
    `/report-comment/manage/${reportId}/pending`,
    {
      method: 'PATCH',
    },
  );
}

// Reply Reports Management
export async function getReplyReports(
  filters: { page?: number; limit?: number; status?: string } = {},
) {
  const params = new URLSearchParams();
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());
  if (filters.status) params.append('status', filters.status);

  const query = params.toString() ? `?${params.toString()}` : '';
  return apiClient<any>(`/report-reply/manage${query}`);
}

export async function getReplyReportDetails(replyPublicId: string) {
  return apiClient<any>(`/report-reply/manage/${replyPublicId}`);
}

export async function acceptReplyReport(reportId: string) {
  return apiClient<{ message: string }>(
    `/report-reply/manage/${reportId}/accept`,
    {
      method: 'PATCH',
    },
  );
}

export async function rejectReplyReport(reportId: string) {
  return apiClient<{ message: string }>(
    `/report-reply/manage/${reportId}/reject`,
    {
      method: 'PATCH',
    },
  );
}

export async function setReplyReportPending(reportId: string) {
  return apiClient<{ message: string }>(
    `/report-reply/manage/${reportId}/pending`,
    {
      method: 'PATCH',
    },
  );
}
