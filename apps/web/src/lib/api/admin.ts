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

// User Management
export async function getUsers(filters: UserFilters = {}) {
  const params = new URLSearchParams();
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());
  if (filters.search) params.append('search', filters.search);
  if (filters.roles?.length) {
    filters.roles.forEach((role) => params.append('roles', role));
  }
  if (filters.isEmailVerified !== undefined) {
    params.append('isEmailVerified', filters.isEmailVerified.toString());
  }

  const query = params.toString() ? `?${params.toString()}` : '';
  return apiClient<PaginatedResponse<User>>(`/admin/users${query}`);
}

export async function updateUser(userId: string, data: UpdateUserDto) {
  return apiClient<User>(`/admin/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteUser(userId: string) {
  return apiClient<{ message: string }>(`/admin/users/${userId}`, {
    method: 'DELETE',
  });
}

// Establishment Management
export async function getEstablishments(filters: EstablishmentFilters = {}) {
  const params = new URLSearchParams();
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());
  if (filters.search) params.append('search', filters.search);
  if (filters.minRating) params.append('minRating', filters.minRating.toString());
  if (filters.maxRating) params.append('maxRating', filters.maxRating.toString());

  const query = params.toString() ? `?${params.toString()}` : '';
  return apiClient<PaginatedResponse<Establishment>>(`/admin/establishments${query}`);
}

export async function deleteEstablishment(establishmentId: string) {
  return apiClient<{ message: string }>(`/admin/establishments/${establishmentId}`, {
    method: 'DELETE',
  });
}

// Partner Applications
export async function getPartnerApplications(
  filters: PartnerApplicationFilters = {}
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
    `/admin/partner-applications${query}`
  );
}

export async function reviewPartnerApplication(
  applicationId: string,
  data: ReviewPartnerApplicationDto
) {
  return apiClient<PartnerApplication>(
    `/admin/partner-applications/${applicationId}/review`,
    {
      method: 'PATCH',
      body: JSON.stringify(data),
    }
  );
}

// Reports Management
export async function getReports(filters: ReportFilters = {}) {
  const params = new URLSearchParams();
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());
  if (filters.search) params.append('search', filters.search);
  if (filters.type?.length) {
    filters.type.forEach((type) => params.append('type', type));
  }
  if (filters.status?.length) {
    filters.status.forEach((status) => params.append('status', status));
  }

  const query = params.toString() ? `?${params.toString()}` : '';
  return apiClient<PaginatedResponse<Report>>(`/admin/reports${query}`);
}

export async function resolveReport(reportId: string, data: ResolveReportDto) {
  return apiClient<Report>(`/admin/reports/${reportId}/resolve`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

// Comments Management
export async function getComments(filters: CommentFilters = {}) {
  const params = new URLSearchParams();
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());
  if (filters.search) params.append('search', filters.search);
  if (filters.establishmentId) params.append('establishmentId', filters.establishmentId);
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
