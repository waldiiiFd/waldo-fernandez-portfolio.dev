export type EmailParams = {
  from_name: string;
  from_email: string;
  subject: string;
  message: string;
};

export interface EmailService {
  send(params: EmailParams): Promise<void>;
}

type EmailJsClient = (typeof import("@emailjs/browser"))["default"];

export interface EmailJsConfig {
  serviceId?: string;
  templateId?: string;
  publicKey?: string;
}

export class EmailJsService implements EmailService {
  private readonly config: EmailJsConfig;
  private clientPromise: Promise<EmailJsClient> | null = null;

  constructor(config: EmailJsConfig) {
    this.config = config;
  }

  private loadClient(publicKey: string): Promise<EmailJsClient> {
    this.clientPromise ??= import("@emailjs/browser")
      .then(({ default: emailjs }) => {
        emailjs.init({ publicKey });
        return emailjs;
      })
      .catch((error) => {
        this.clientPromise = null;
        throw error;
      });
    return this.clientPromise;
  }

  async send(params: EmailParams): Promise<void> {
    const { serviceId, templateId, publicKey } = this.config;
    if (!serviceId || !templateId || !publicKey) {
      throw new Error(
        "EmailJS no está configurado: faltan variables PUBLIC_EMAILJS_*",
      );
    }
    const client = await this.loadClient(publicKey);
    await client.send(serviceId, templateId, params);
  }
}

export function createEmailService(): EmailService {
  return new EmailJsService({
    serviceId: import.meta.env.PUBLIC_EMAILJS_SERVICE_ID,
    templateId: import.meta.env.PUBLIC_EMAILJS_TEMPLATE_ID,
    publicKey: import.meta.env.PUBLIC_EMAILJS_PUBLIC_KEY,
  });
}
