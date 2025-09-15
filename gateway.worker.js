// gateway_worker_all_ops_merged.js
// Gateway worker: merged ops (user + uploaded file) + raw upload passthrough; no base64/presign logic.

const OPS = [
  {"operation":"createLead","method":"POST","path":"/api/v1/leads"},
  {"operation":"createLeadImportHomeadvisorLead","method":"POST","path":"/api/v1/leads/import-homeadvisor-lead"},
  {"operation":"deleteLead","method":"DELETE","path":"/api/v1/leads/{leadId}"},
  {"operation":"updateLead","method":"PUT","path":"/api/v1/leads/{leadId}"},
  {"operation":"getAcculynxCountries","method":"GET","path":"/api/v2/acculynx/countries"},
  {"operation":"getAcculynxCountriesByCountryId","method":"GET","path":"/api/v2/acculynx/countries/{countryId}"},
  {"operation":"getAcculynxCountriesStatesByCountryId","method":"GET","path":"/api/v2/acculynx/countries/{countryId}/states"},
  {"operation":"getAcculynxCountriesStatesByCountryIdByStateId","method":"GET","path":"/api/v2/acculynx/countries/{countryId}/states/{stateId}"},
  {"operation":"getCalendars","method":"GET","path":"/api/v2/calendars"},
  {"operation":"getCalendarsAppointmentsByCalendarId","method":"GET","path":"/api/v2/calendars/{calendarId}/appointments"},
  {"operation":"getCalendarAppointmentsByCalendarIdByAppointmentId","method":"GET","path":"/api/v2/calendars/{calendarId}/appointments/{appointmentId}"},
  {"operation":"getCompanySettings","method":"GET","path":"/api/v2/company-settings"},
  {"operation":"getCompanySettingsJobFileSettingsDocumentFolders","method":"GET","path":"/api/v2/company-settings/job-file-settings/document-folders"},
  {"operation":"getCompanySettingsJobFileSettingsInsuranceCompanies","method":"GET","path":"/api/v2/company-settings/job-file-settings/insurance-companies"},
  {"operation":"getCompanySettingsJobFileSettingsJobCategories","method":"GET","path":"/api/v2/company-settings/job-file-settings/job-categories"},
  {"operation":"getCompanySettingsJobFileSettingsPhotoVideoTags","method":"GET","path":"/api/v2/company-settings/job-file-settings/photo-video-tags"},
  {"operation":"getCompanySettingsJobFileSettingsTradeTypes","method":"GET","path":"/api/v2/company-settings/job-file-settings/trade-types"},
  {"operation":"getCompanySettingsJobFileSettingsWorkTypes","method":"GET","path":"/api/v2/company-settings/job-file-settings/work-types"},
  {"operation":"getCompanySettingsJobFileSettingsWorkflowMilestones","method":"GET","path":"/api/v2/company-settings/job-file-settings/workflow-milestones"},
  {"operation":"getCompanySettingsJobFileSettingsWorkflowMilestonesStatusesByMilestone","method":"GET","path":"/api/v2/company-settings/job-file-settings/workflow-milestones/{milestone}/statuses"},
  {"operation":"getCompanySettingsLeadsLeadSources","method":"GET","path":"/api/v2/company-settings/leads/lead-sources"},
  {"operation":"getCompanySettingLeadsLeadSourcesByLeadSourceId","method":"GET","path":"/api/v2/company-settings/leads/lead-sources/{leadSourceId}"},
  {"operation":"getCompanySettingLeadsLeadSourcesChildrenByLeadSourceParentIdByLeadSourceId","method":"GET","path":"/api/v2/company-settings/leads/lead-sources/{leadSourceParentId}/children/{leadSourceId}"},
  {"operation":"getCompanySettingsLocationSettingsAccountTypes","method":"GET","path":"/api/v2/company-settings/location-settings/account-types"},
  {"operation":"getCompanySettingLocationSettingsAccountTypesByAccountTypeId","method":"GET","path":"/api/v2/company-settings/location-settings/account-types/{accountTypeId}"},
  {"operation":"getCompanySettingsLocationSettingsCountries","method":"GET","path":"/api/v2/company-settings/location-settings/countries"},
  {"operation":"getCompanySettingsLocationSettingsCountriesStatesByCountryId","method":"GET","path":"/api/v2/company-settings/location-settings/countries/{countryId}/states"},
  {"operation":"getCompanySettings","method":"GET","path":"/api/v2/company/settings"},
  {"operation":"getCompanySettingsJobFileSettingsDocumentFolders","method":"GET","path":"/api/v2/company/settings/jobFileSettings/documentFolders"},
  {"operation":"getCompanySettingsJobFileSettingsInsuranceCompanies","method":"GET","path":"/api/v2/company/settings/jobFileSettings/insuranceCompanies"},
  {"operation":"getCompanySettingsJobFileSettingsJobCategories","method":"GET","path":"/api/v2/company/settings/jobFileSettings/jobCategories"},
  {"operation":"getCompanySettingsJobFileSettingsPhotoVideoTags","method":"GET","path":"/api/v2/company/settings/jobFileSettings/photoVideoTags"},
  {"operation":"getCompanySettingsJobFileSettingsTradeTypes","method":"GET","path":"/api/v2/company/settings/jobFileSettings/tradeTypes"},
  {"operation":"getCompanySettingsJobFileSettingsWorkTypes","method":"GET","path":"/api/v2/company/settings/jobFileSettings/workTypes"},
  {"operation":"getCompanySettingsJobFileSettingsWorkflowMilestones","method":"GET","path":"/api/v2/company/settings/jobFileSettings/workflowMilestones"},
  {"operation":"getCompanySettingsJobFileSettingsWorkflowMilestonesStatusesByMilestone","method":"GET","path":"/api/v2/company/settings/jobFileSettings/workflowMilestones/{milestone}/statuses"},
  {"operation":"getCompanySettingsLeadsLeadSources","method":"GET","path":"/api/v2/company/settings/leads/leadSources"},
  {"operation":"getCompanySettingLeadsLeadSourcesByLeadSourceId","method":"GET","path":"/api/v2/company/settings/leads/leadSources/{leadSourceId}"},
  {"operation":"getCompanySettingLeadsLeadSourcesChildrenByLeadSourceParentIdByLeadSourceId","method":"GET","path":"/api/v2/company/settings/leads/leadSources/{leadSourceParentId}/children/{leadSourceId}"},
  {"operation":"getCompanySettingsLocationSettingsAccountTypes","method":"GET","path":"/api/v2/company/settings/locationSettings/accountTypes"},
  {"operation":"getCompanySettingLocationSettingsAccountTypesByAccountTypeId","method":"GET","path":"/api/v2/company/settings/locationSettings/accountTypes/{accountTypeId}"},
  {"operation":"getCompanySettingsLocationSettingsCountries","method":"GET","path":"/api/v2/company/settings/locationSettings/countries"},
  {"operation":"getCompanySettingsLocationSettingsCountriesStatesByCountryId","method":"GET","path":"/api/v2/company/settings/locationSettings/countries/{countryId}/states"},
  {"operation":"getCompanySettingsLocationSettingsCountriesStatesByCountryIdByStateId","method":"GET","path":"/api/v2/company/settings/locationSettings/countries/{countryId}/states/{stateId}"},
  {"operation":"getContacts","method":"GET","path":"/api/v2/contacts"},
  {"operation":"createContact","method":"POST","path":"/api/v2/contacts"},
  {"operation":"createContactSearch","method":"POST","path":"/api/v2/contacts/search"},
  {"operation":"deleteContact","method":"DELETE","path":"/api/v2/contacts/{contactId}"},
  {"operation":"getContactByContactId","method":"GET","path":"/api/v2/contacts/{contactId}"},
  {"operation":"updateContact","method":"PUT","path":"/api/v2/contacts/{contactId}"},
  {"operation":"getContactsEmailAddressesByContactId","method":"GET","path":"/api/v2/contacts/{contactId}/emailAddresses"},
  {"operation":"getContactsPhoneNumbersByContactId","method":"GET","path":"/api/v2/contacts/{contactId}/phoneNumbers"},
  {"operation":"getAcculynxCountries","method":"GET","path":"/api/v2/countries"},
  {"operation":"getAcculynxCountriesByCountryId","method":"GET","path":"/api/v2/countries/{countryId}"},
  {"operation":"getAcculynxCountriesStatesByCountryId","method":"GET","path":"/api/v2/countries/{countryId}/states"},
  {"operation":"getAcculynxCountriesStatesByCountryIdByStateId","method":"GET","path":"/api/v2/countries/{countryId}/states/{stateId}"},
  {"operation":"getDiagnosticsPing","method":"GET","path":"/api/v2/diagnostics/ping"},
  {"operation":"getEstimates","method":"GET","path":"/api/v2/estimates"},
  {"operation":"createEstimate","method":"POST","path":"/api/v2/estimates"},
  {"operation":"deleteEstimate","method":"DELETE","path":"/api/v2/estimates/{estimateId}"},
  {"operation":"getEstimateByEstimateId","method":"GET","path":"/api/v2/estimates/{estimateId}"},
  {"operation":"updateEstimate","method":"PUT","path":"/api/v2/estimates/{estimateId}"},
  {"operation":"getEstimatesSectionsByEstimateId","method":"GET","path":"/api/v2/estimates/{estimateId}/sections"},
  {"operation":"getEstimateSectionsByEstimateIdByEstimateSectionId","method":"GET","path":"/api/v2/estimates/{estimateId}/sections/{sectionId}"},
  {"operation":"getEstimatesSectionsItemsByEstimateIdByEstimateSectionId","method":"GET","path":"/api/v2/estimates/{estimateId}/sections/{sectionId}/items"},
  {"operation":"getEstimateSectionsItemsByEstimateIdByEstimateSectionIdByEstimateItemId","method":"GET","path":"/api/v2/estimates/{estimateId}/sections/{sectionId}/items/{itemId}"},
  {"operation":"getFinancialByFinancialsId","method":"GET","path":"/api/v2/financials/{financialsId}"},
  {"operation":"getFinancialsAmendmentsByFinancialsId","method":"GET","path":"/api/v2/financials/{financialsId}/amendments"},
  {"operation":"getFinancialAmendmentsByFinancialsIdByFinancialsAmendmentId","method":"GET","path":"/api/v2/financials/{financialsId}/amendments/{amendmentId}"},
  {"operation":"getFinancialsWorksheetByFinancialsId","method":"GET","path":"/api/v2/financials/{financialsId}/worksheet"},
  {"operation":"getInvoices","method":"GET","path":"/api/v2/invoices"},
  {"operation":"createInvoice","method":"POST","path":"/api/v2/invoices"},
  {"operation":"deleteInvoice","method":"DELETE","path":"/api/v2/invoices/{invoiceId}"},
  {"operation":"getInvoiceByInvoiceId","method":"GET","path":"/api/v2/invoices/{invoiceId}"},
  {"operation":"updateInvoice","method":"PUT","path":"/api/v2/invoices/{invoiceId}"},
  {"operation":"getJobs","method":"GET","path":"/api/v2/jobs"},
  {"operation":"createJob","method":"POST","path":"/api/v2/jobs"},
  {"operation":"createJobExternalReferences","method":"POST","path":"/api/v2/jobs/external-references"},
  {"operation":"createJobSearch","method":"POST","path":"/api/v2/jobs/search"},
  {"operation":"deleteJob","method":"DELETE","path":"/api/v2/jobs/{jobId}"},
  {"operation":"getJobByJobId","method":"GET","path":"/api/v2/jobs/{jobId}"},
  {"operation":"updateJob","method":"PUT","path":"/api/v2/jobs/{jobId}"},
  {"operation":"getJobsAccountingIntegrationStatusByJobId","method":"GET","path":"/api/v2/jobs/{jobId}/accountingIntegrationStatus"},
  {"operation":"getJobsAdjusterByJobId","method":"GET","path":"/api/v2/jobs/{jobId}/adjuster"},
  {"operation":"getJobsContactsByJobId","method":"GET","path":"/api/v2/jobs/{jobId}/contacts"},
  {"operation":"getJobsContractWorksheetByJobId","method":"GET","path":"/api/v2/jobs/{jobId}/contractWorksheet"},
  {"operation":"createJobDocumentsByJobId","method":"POST","path":"/api/v2/jobs/{jobId}/documents"},
  {"operation":"getJobsEstimatesByJobId","method":"GET","path":"/api/v2/jobs/{jobId}/estimates"},
  {"operation":"getJobsExternalReferences","method":"GET","path":"/api/v2/jobs/{jobId}/externalReferences"},
  {"operation":"createJobExternalReferences","method":"POST","path":"/api/v2/jobs/{jobId}/externalReferences"},
  {"operation":"getFinancialsByJobId","method":"GET","path":"/api/v2/jobs/{jobId}/financials"},
  {"operation":"getJobsFinancialsByJobId","method":"GET","path":"/api/v2/jobs/{jobId}/financials"},
  {"operation":"getJobsHistoryByJobId","method":"GET","path":"/api/v2/jobs/{jobId}/history"},
  {"operation":"updateJobInitialAppointmentByJobId","method":"PUT","path":"/api/v2/jobs/{jobId}/initial-appointment"},
  {"operation":"getJobsInitialAppointmentByJobId","method":"GET","path":"/api/v2/jobs/{jobId}/initialAppointment"},
  {"operation":"updateJobInitialAppointmentByJobId","method":"PUT","path":"/api/v2/jobs/{jobId}/initialAppointment"},
  {"operation":"getJobsInsuranceByJobId","method":"GET","path":"/api/v2/jobs/{jobId}/insurance"},
  {"operation":"updateJobInsuranceInsuranceCompanyByJobId","method":"PUT","path":"/api/v2/jobs/{jobId}/insurance/insurance-company"},
  {"operation":"updateJobInsuranceInsuranceCompanyByJobId","method":"PUT","path":"/api/v2/jobs/{jobId}/insurance/{insuranceCompanyId}"},
  {"operation":"getJobsInvoicesByJobId","method":"GET","path":"/api/v2/jobs/{jobId}/invoices"},
  {"operation":"createJobMeasurementsFilesByJobId","method":"POST","path":"/api/v2/jobs/{jobId}/measurements/files"},
  {"operation":"createJobMessagesByJobId","method":"POST","path":"/api/v2/jobs/{jobId}/messages"},
  {"operation":"createJobMessagesRepliesByJobIdByMessageId","method":"POST","path":"/api/v2/jobs/{jobId}/messages/{messageId}/replies"},
  {"operation":"getJobsMilestonesCurrentByJobId","method":"GET","path":"/api/v2/jobs/{jobId}/milestones/current"},
  {"operation":"getJobsMilestonesHistoryByJobId","method":"GET","path":"/api/v2/jobs/{jobId}/milestones/history"},
  {"operation":"getJobMilestonesByJobIdByMilestoneId","method":"GET","path":"/api/v2/jobs/{jobId}/milestones/{milestoneId}"},
  {"operation":"getJobMilestonesStatusByJobIdByMilestoneIdByStatusId","method":"GET","path":"/api/v2/jobs/{jobId}/milestones/{milestoneId}/statuses/{statusId}"},
  {"operation":"getJobsPaymentsByJobId","method":"GET","path":"/api/v2/jobs/{jobId}/payments"},
  {"operation":"createJobPaymentsExpenseByJobId","method":"POST","path":"/api/v2/jobs/{jobId}/payments/expense"},
  {"operation":"getJobsPaymentsOverviewByJobId","method":"GET","path":"/api/v2/jobs/{jobId}/payments/overview"},
  {"operation":"createJobPaymentsPaidByJobId","method":"POST","path":"/api/v2/jobs/{jobId}/payments/paid"},
  {"operation":"createJobPaymentsReceivedByJobId","method":"POST","path":"/api/v2/jobs/{jobId}/payments/received"},
  {"operation":"createJobPhotosVideosByJobId","method":"POST","path":"/api/v2/jobs/{jobId}/photos-videos"},
  {"operation":"createJobPhotosVideosByJobId","method":"POST","path":"/api/v2/jobs/{jobId}/photosVideos"},
  {"operation":"getJobsRepresentativesByJobId","method":"GET","path":"/api/v2/jobs/{jobId}/representatives"},
  {"operation":"deleteJobRepresentativesArOwnerByJobId","method":"DELETE","path":"/api/v2/jobs/{jobId}/representatives/ar-owner"},
  {"operation":"createJobRepresentativesArOwnerByJobId","method":"POST","path":"/api/v2/jobs/{jobId}/representatives/ar-owner"},
  {"operation":"deleteJobRepresentativesArOwnerByJobId","method":"DELETE","path":"/api/v2/jobs/{jobId}/representatives/arOwner"},
  {"operation":"createJobRepresentativesArOwnerByJobId","method":"POST","path":"/api/v2/jobs/{jobId}/representatives/arOwner"},
  {"operation":"getJobsRepresentativesCompanyByJobId","method":"GET","path":"/api/v2/jobs/{jobId}/representatives/company"},
  {"operation":"createJobRepresentativesCompanyByJobId","method":"POST","path":"/api/v2/jobs/{jobId}/representatives/company"},
  {"operation":"deleteJobRepresentativesSalesOwnerByJobId","method":"DELETE","path":"/api/v2/jobs/{jobId}/representatives/sales-owner"},
  {"operation":"createJobRepresentativesSalesOwnerByJobId","method":"POST","path":"/api/v2/jobs/{jobId}/representatives/sales-owner"},
  {"operation":"deleteJobRepresentativesSalesOwnerByJobId","method":"DELETE","path":"/api/v2/jobs/{jobId}/representatives/salesOwner"},
  {"operation":"createJobRepresentativesSalesOwnerByJobId","method":"POST","path":"/api/v2/jobs/{jobId}/representatives/salesOwner"},
  {"operation":"getLeads","method":"GET","path":"/api/v2/leads"},
  {"operation":"createLead","method":"POST","path":"/api/v2/leads"},
  {"operation":"createLeadImportHomeadvisorLead","method":"POST","path":"/api/v2/leads/import/homeadvisor"},
  {"operation":"deleteLead","method":"DELETE","path":"/api/v2/leads/{leadId}"},
  {"operation":"getLeadByLeadId","method":"GET","path":"/api/v2/leads/{leadId}"},
  {"operation":"updateLead","method":"PUT","path":"/api/v2/leads/{leadId}"},
  {"operation":"getLeadsHistoryByLeadId","method":"GET","path":"/api/v2/leads/{leadId}/history"},
  {"operation":"getR2DownloadUrl","method":"POST","path":"/api/v2/r2/downloadUrl"},
  {"operation":"getR2UploadUrl","method":"POST","path":"/api/v2/r2/uploadUrl"},
  {"operation":"getAdvancedReports","method":"GET","path":"/api/v2/reports/advanced"},
  {"operation":"getReportsScheduledReportsRunsByScheduledReportId","method":"GET","path":"/api/v2/reports/scheduledReports/{scheduledReportId}/runs"},
  {"operation":"getReportsScheduledReportsRunsLatestByScheduledReportId","method":"GET","path":"/api/v2/reports/scheduledReports/{scheduledReportId}/runs/latest"},
  {"operation":"getReportScheduledReportsRunsByScheduledReportIdByInstanceRunId","method":"GET","path":"/api/v2/reports/scheduledReports/{scheduledReportId}/runs/{instanceRunId}"},
  {"operation":"getReportsScheduledReportsRunsRecipientsByScheduledReportIdByInstanceRunId","method":"GET","path":"/api/v2/reports/scheduledReports/{scheduledReportId}/runs/{instanceRunId}/recipients"},
  {"operation":"getReportScheduledReportsRunsRecipientsByScheduledReportIdByInstanceRunIdByRecipientId","method":"GET","path":"/api/v2/reports/scheduledReports/{scheduledReportId}/runs/{instanceRunId}/recipients/{recipientId}"},
  {"operation":"getSupplements","method":"GET","path":"/api/v2/supplements"},
  {"operation":"createSupplement","method":"POST","path":"/api/v2/supplements"},
  {"operation":"deleteSupplement","method":"DELETE","path":"/api/v2/supplements/{supplementId}"},
  {"operation":"getSupplementBySupplementId","method":"GET","path":"/api/v2/supplements/{supplementId}"},
  {"operation":"updateSupplement","method":"PUT","path":"/api/v2/supplements/{supplementId}"},
  {"operation":"createTransaction","method":"POST","path":"/api/v2/transactions"},
  {"operation":"updateTransaction","method":"PUT","path":"/api/v2/transactions/{transactionId}"},
  {"operation":"uploadDocumentRaw","method":"POST","path":"/api/v2/uploads/raw"},
  {"operation":"getUsers","method":"GET","path":"/api/v2/users"},
  {"operation":"createUser","method":"POST","path":"/api/v2/users"},
  {"operation":"deleteUser","method":"DELETE","path":"/api/v2/users/{userId}"},
  {"operation":"getUserByUserId","method":"GET","path":"/api/v2/users/{userId}"},
  {"operation":"updateUser","method":"PUT","path":"/api/v2/users/{userId}"},
  {"operation":"changeUserRole","method":"POST","path":"/api/v2/users/{userId}/change-role"},
  {"operation":"deactivateUser","method":"POST","path":"/api/v2/users/{userId}/deactivate"},
  {"operation":"listWebhookSubscriptions","method":"GET","path":"/api/v2/webhooks/subscriptions"},
  {"operation":"createWebhookSubscription","method":"POST","path":"/api/v2/webhooks/subscriptions"},
  {"operation":"deleteWebhookSubscription","method":"DELETE","path":"/api/v2/webhooks/subscriptions/{subscriptionId}"}
];

export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);

      // Meta
      if (request.method === 'GET' && url.pathname === '/gateway/meta') {
        return json({ ok: true, counts: { total: OPS.length }, operations: OPS.map(o => o.operation) });
      }

      // Raw upload passthrough (stream body as-is)
      // Usage: POST /gateway/raw?operation=uploadDocumentRaw OR /gateway/raw?path=/api/v2/uploads/raw&method=POST
      if (url.pathname === '/gateway/raw') {
        const qop = url.searchParams.get('operation');
        const qpath = url.searchParams.get('path');
        const qmethod = (url.searchParams.get('method') || 'POST').toUpperCase();
        const actorUserId = url.searchParams.get('actorUserId') || undefined;

        let entry = null;
        if (qop) entry = OPS.find(o => o.operation === qop);
        if (!entry && qpath) entry = OPS.find(o => o.path === qpath && o.method === qmethod);

        if (!entry) return json({ ok: false, error: { code: 'UNKNOWN_OPERATION_OR_PATH' } }, 400);

        const upstreamUrl = 'https://api.acculynx.com' + entry.path;
        const headers = new Headers(request.headers);
        headers.set('authorization', `Bearer ${selectUpstreamToken(env, actorUserId)}`);

        // Do not forward hop-by-hop headers
        ['host', 'content-length'].forEach(h => headers.delete(h));

        const res = await fetch(upstreamUrl, { method: entry.method, headers, body: request.body });
        return new Response(res.body, { status: res.status, headers: res.headers });
      }

      // JSON dispatch
      if (!(request.method === 'POST' && url.pathname === '/gateway')) {
        return json({ ok: false, error: { code: 'NOT_FOUND' } }, 404);
      }

      const body = await request.json().catch(() => null);
      if (!body || typeof body !== 'object') { return json({ ok: false, error: { code: 'BAD_REQUEST', details: 'Invalid JSON' } }, 400); }

      const { operation, params = {}, timeoutMs = 30000, actorUserId } = body;
      const entry = OPS.find(o => o.operation === operation);
      if (!entry) return json({ ok: false, error: { code: 'UNKNOWN_OPERATION', operation } }, 400);

      const upstreamUrl = buildUrl('https://api.acculynx.com' + entry.path, params.path, params.query);
      const method = entry.method;
      const contentType = params.contentType || 'application/json';

      const headers = new Headers({ 'accept': 'application/json' });
      headers.set('authorization', `Bearer ${selectUpstreamToken(env, actorUserId)}`);

      let upstreamBody = undefined;
      if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
        if (contentType === 'multipart/form-data') {
          const form = new FormData();
          for (const [k, v] of Object.entries(params.body || {})) form.append(k, String(v));
          upstreamBody = form;
          // let runtime set content-type boundary
        } else if (contentType === 'application/x-www-form-urlencoded') {
          const form = new URLSearchParams();
          for (const [k, v] of Object.entries(params.body || {})) form.set(k, String(v));
          headers.set('content-type', 'application/x-www-form-urlencoded');
          upstreamBody = form;
        } else {
          headers.set('content-type', 'application/json');
          upstreamBody = params.body ? JSON.stringify(params.body) : undefined;
        }
      }

      const res = await fetchWithTimeout(upstreamUrl, { method, headers, body: upstreamBody }, timeoutMs);
      const text = await res.text();
      const ctype = res.headers.get('content-type') || '';
      let data = text;
      if (ctype.includes('application/json')) { try { data = JSON.parse(text); } catch {} }

      return new Response(ctype.includes('application/json') ? JSON.stringify(data) : text, { status: res.status, headers: { 'content-type': ctype.includes('application/json') ? 'application/json' : 'text/plain' } });
    } catch (err) {
      return json({ ok: false, error: { code: 'GATEWAY_ERROR', message: String(err?.stack || err) } }, 500);
    }
  }
};

// ======== helpers ========
function buildUrl(template, pathVars = {}, query = {
}) {
  let url = template.replace(/\{(.*?)\}/g, (_, k) => encodeURIComponent(String(pathVars?.[k] ?? '')));
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(query || {})) { if (v !== undefined && v !== null && v !== '') qs.set(k, String(v)); }
  const q = qs.toString();
  if (q) url += (url.includes('?') ? '&' : '?') + q;
  return url;
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json' } });
}

async function fetchWithTimeout(url, init, timeoutMs = 30000) {
  const controller = new AbortController();
  const to = setTimeout(() => controller.abort('timeout'), timeoutMs);
  try {
    const res = await fetch(url, { ...init, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(to);
  }
}

function selectUpstreamToken(env, actorUserId) {
  if (actorUserId) {
    const key = `ACCULYNX_TOKEN__${actorUserId}`;
    if (env[key]) return env[key];
  }
  return env.ACCULYNX_TOKEN;
}
