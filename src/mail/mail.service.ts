import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { renderFile } from 'ejs';
import { htmlToText } from 'html-to-text';
import { createTransport } from 'nodemailer';
import { join } from 'path';
import mailConfig from './configs/mail.config';
import { SendMailInput } from './types/send-mail-input.type';

@Injectable()
export class MailService {
  constructor(
    @Inject(mailConfig.KEY)
    private readonly mailConfiguration: ConfigType<typeof mailConfig>,
  ) {}
  private get __transporter() {
    return createTransport({
      host: this.mailConfiguration.host,
      port: this.mailConfiguration.port,
      secure: false, // Use `true` for port 465, `false` for all other ports
      auth: {
        user: this.mailConfiguration.user,
        pass: this.mailConfiguration.password,
      },
    });
  }

  async send({
    from = this.mailConfiguration.from,
    to,
    subject,
    text = '',
    html = '',
    htmlInput = {},
  }: SendMailInput) {
    let textFromHtml: string = text;
    let renderedHtml = undefined;
    if (html) {
      renderedHtml = await renderFile(
        join(__dirname, '..', '..', 'views', 'email', `${html}.ejs`),
        htmlInput,
      );

      textFromHtml = htmlToText(renderedHtml);
    }
    return this.__transporter.sendMail({
      from,
      to,
      subject,
      text: textFromHtml,
      html: renderedHtml,
    });
  }
}
