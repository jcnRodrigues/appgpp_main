const DEFAULT_REFRESH_MS = 30000;

export function getDashboardRefreshMs() {
    const raw = process.env.NEXT_PUBLIC_DASHBOARD_REFRESH_MS;
    if (raw === undefined || raw === null || raw === '') return DEFAULT_REFRESH_MS;

    const parsed = Number(raw);
    if (!Number.isFinite(parsed)) return DEFAULT_REFRESH_MS;
    if (parsed === 0) return 0;

    return parsed >= 5000 ? parsed : DEFAULT_REFRESH_MS;
}
