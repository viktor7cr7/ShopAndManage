import { simpleParser } from "mailparser";
import Imap from "imap";

export class MailHelper {
  async getActivationLink(email) {
    return new Promise((resolve, reject) => {
      const imap = new Imap({
        user: "dmitriiletob324@gmail.com",
        password: "klju tyzu zhzr lqrb",
        host: "imap.gmail.com",
        port: 993,
        tlsOptions: { rejectUnauthorized: false },
        tls: true,
      });

      function openInbox(cb) {
        imap.openBox("INBOX", false, cb);
      }

      function checkEmailWithDelay(attempts, delay) {
        if (attempts === 0) {
          console.log("Попытки закончились. Выход");
          imap.end();
          reject(new Error("Непрочитанных писем не обнаружено"));
          return;
        }

        imap.search(
          ["UNSEEN", ["HEADER", "SUBJECT", "Email Confirmation"]],
          function (err, results) {
            if (err) {
              console.error("Ошибка поиска", err);
              imap.end();
              return;
            }

            if (results.length === 0) {
              console.log(
                "Нет непрочитанных письем с указанной темой, повторная попытка.."
              );
              setTimeout(() => checkEmailWithDelay(attempts - 1, delay), delay);
              return;
            }

            imap.addFlags(results, "\\Seen", (err) => {
              if (err) {
                console.error(
                  "Ошибка пометки электронного письма как прочитанного",
                  err
                );
              }
            });

            const f = imap.fetch(results, { bodies: "" });
            f.on("message", function (msg) {
              msg.on("body", function (stream) {
                simpleParser(stream, (err, parsed) => {
                  if (err) reject(err);
                  const activationLink = parsed.text.match(
                    /https?:\/\/[^\s\]\["]+/g
                  )[0];
                  resolve(activationLink);
                });
              });
            });
            f.once("error", function (err) {
              reject(err);
            });
            f.once("end", function () {
              imap.end();
            });
          }
        );
      }
      imap.once("ready", function () {
        openInbox(function (err) {
          if (err) throw err;
          checkEmailWithDelay(5, 5000); // 5 попыток по 5 секунд
        });
      });

      imap.once("error", function (err) {
        reject(err);
      });

      imap.once("end", function () {
        console.log("Конец соединения");
      });

      imap.connect();
    });
  }
}
