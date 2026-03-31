请求接口http://smtp-relay.brevo.com:587，文档内容如下：***

title: SMTP relay integration
subtitle: Configure the SMTP relay to send transactional emails from your email client
slug: docs/smtp-integration
---------------------------

Use the SMTP relay to send transactional emails from your email client or application. Send order confirmations, password resets, account creation notifications, and other automated messages.

## SMTP credentials

Retrieve your SMTP username and password from [SMTP and API settings](https://app.brevo.com/settings/keys/smtp). Under the "SMTP" tab, copy existing credentials or generate new ones.

<Frame background="subtle">
  ![SMTP credentials settings](file:848a6808-8054-40ec-995a-300c44e73312)
</Frame>

<Warning>
  Use an SMTP key, not an API key, for SMTP relay connections.
</Warning>

### Connection settings

**Ports:**

* **Non-encrypted**: Use ports 587 or 2525
* **Encrypted**: Use port 465 with SSL or TLS encryption

**Encryption:**

* Leave empty unless using port 465, which requires SSL or TLS encryption

## SMTP parameters

The following parameters are available for SMTP relay messages:

| Parameter         | Type             | Description                                                                                                                                        | Example                                                              |
| ----------------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| `sender`          | Object           | Sender information. Required if `templateId` is not provided. Pass `name` (optional) and `email`, or `id`. If `id` is provided, `name` is ignored. | `{"name":"Support", "email":"no-reply@brevo.com"}` or `{"id":2}`     |
| `to`              | Array of objects | Recipient email addresses and names (optional). Required if `messageVersions` is not provided. Ignored if `messageVersions` is provided.           | `[{"name":"John", "email":"john@example.com"}]`                      |
| `bcc`             | Array of objects | BCC recipient email addresses and names (optional).                                                                                                | `[{"name":"Admin", "email":"admin@example.com"}]`                    |
| `cc`              | Array of objects | CC recipient email addresses and names (optional).                                                                                                 | `[{"name":"Manager", "email":"manager@example.com"}]`                |
| `htmlContent`     | String           | HTML body of the message. Required if `templateId` is not provided. Ignored if `templateId` is provided.                                           | `<!DOCTYPE html><html><body><p>Content</p></body></html>`            |
| `textContent`     | String           | Plain text body of the message. Ignored if `templateId` is provided.                                                                               | `"Plain text content"`                                               |
| `subject`         | String           | Email subject line. Required if `templateId` is not provided.                                                                                      | `"Your order confirmation"`                                          |
| `replyTo`         | Object           | Reply-to email address (required) and name (optional).                                                                                             | `{"email":"support@brevo.com", "name":"Support Team"}`               |
| `attachment`      | Array of objects | Attachments. Provide absolute URL (no local files) or base64-encoded content with attachment name. Name is required if content is provided.        | See attachment object attributes below                               |
| `headers`         | Object           | Custom headers (non-standard) to include in the email.                                                                                             | `{"X-Custom-Header":"value"}`                                        |
| `templateId`      | Int64            | Template ID to use for the email.                                                                                                                  | `2`                                                                  |
| `params`          | Object           | Template variables for customization. Only applies to templates using New Template Language format.                                                | `{"FNAME":"John", "LNAME":"Doe"}`                                    |
| `messageVersions` | Array of objects | Multiple message versions with personalized content. See API reference for details.                                                                | Contains multiple versions with same sender and recipient parameters |
| `tags`            | Array of strings | Tags to categorize and filter emails.                                                                                                              | `["order", "confirmation"]`                                          |
| `scheduledAt`     | date-time        | UTC date-time for scheduled delivery (YYYY-MM-DDTHH:mm:ss.SSSZ). Include timezone. Expected delay of up to 5 minutes. Currently in public beta.    | `2022-04-05T12:30:00+02:00`                                          |
| `batchId`         | String           | UUIDv4 batch identifier for scheduled batch transactional emails. Auto-generated if not provided.                                                  | `5c6cfa04-eed9-42c2-8b5c-6d470d978e9d`                               |

### Sender object

| Attribute | Type   | Description                                                                                     | Example                |
| --------- | ------ | ----------------------------------------------------------------------------------------------- | ---------------------- |
| `name`    | String | Sender display name. Maximum 70 characters. Only applicable when `email` is provided.           | `"Support Team"`       |
| `email`   | String | Sender email address. Required if `id` is not provided.                                         | `"no-reply@brevo.com"` |
| `id`      | Int64  | Sender ID. Use to select a sender with a specific IP pool. Required if `email` is not provided. | `2`                    |

### Recipient objects (to, bcc, cc)

| Attribute | Type   | Description                                    | Example              |
| --------- | ------ | ---------------------------------------------- | -------------------- |
| `email`   | String | Recipient email address.                       | `"user@example.com"` |
| `name`    | String | Recipient display name. Maximum 70 characters. | `"John Doe"`         |

### Reply-to object

| Attribute | Type   | Description                                   | Example               |
| --------- | ------ | --------------------------------------------- | --------------------- |
| `email`   | String | Reply-to email address.                       | `"support@brevo.com"` |
| `name`    | String | Reply-to display name. Maximum 70 characters. | `"Support Team"`      |

### Attachment object

| Attribute | Type   | Description                                                    | Example                                |
| --------- | ------ | -------------------------------------------------------------- | -------------------------------------- |
| `url`     | URL    | Absolute URL of the attachment. Local files are not supported. | `"https://example.com/attachment.pdf"` |
| `content` | String | Base64-encoded attachment content.                             | `"b3JkZXIucGRm"`                       |
| `name`    | String | Attachment filename. Required if `content` is provided.        | `"invoice.pdf"`                        |

### Headers object

Custom headers are key-value pairs. The key is the header name, and the value is the header value. Only non-standard headers are supported.

<Info>
  The SMTP relay does not support batch sending. Use the batch sending API endpoints for batch operations. The SMTP relay is designed for transactional emails.
</Info>

<Tip>
  To improve deliverability for B2B emails, consult [Brevo IP ranges](https://help.brevo.com/hc/en-us/articles/208848409--Brevo-IP-ranges-improve-the-deliverability-of-B2B-emails) from the help center.
</Tip>
