# Editorial workflow

1. Import or create records as `draft`; never import lyrics or third-party database dumps without documented permission.
2. Resolve duplicate people, releases, compositions, and recordings before review.
3. Attach a citation to each raga assignment, credit, date, tonic, and explanatory claim.
4. Record lyrics rights separately. A missing rights grant always means “do not display.”
5. Move a record to `in_review`. A reviewer other than the original editor checks facts, Malayalam copy, links, and rights.
6. Publishing writes an audit event and an outbox record. Search updates asynchronously; failed jobs remain retryable.
7. Verify external media within 30 days of launch and on a recurring schedule thereafter.

The sample catalog is for product evaluation. It is not a substitute for the expert review required for the 300-record launch catalog.
