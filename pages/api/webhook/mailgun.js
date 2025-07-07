/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
import { sendEmail } from "@/libs/mailgun";
import config from "@/config";

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case "POST": {
      const emailData = req.body;

      try {
        // extract the email content, subject and sender
        const { "stripped-text": strippedText, subject, sender } = emailData;

        // send email to the admin if forwardRepliesTo is et & emailData exists
        if (
          config.mailgun.forwardRepliesTo &&
          strippedText &&
          subject &&
          sender
        ) {
          await sendEmail(
            config.mailgun.forwardRepliesTo,
            `${config?.appName} | ${subject}`,
            `Subject: ${subject}\n\nFrom: ${sender}\n\nContent:\n${strippedText}`,
            `<div><p>Subject: ${subject}</p><p>From: ${sender}</p><p>Content:</p><p>${strippedText}</p></div>`,
            sender
          );
        }

        return res.status(200).send();
      } catch (e) {
        console.error(e?.message);

        return res.status(500).send();
      }
    }
    default:
      return res.status(200).send();
  }
}
