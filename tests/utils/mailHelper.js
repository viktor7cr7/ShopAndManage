import { simpleParser } from "mailparser";
import Imap from 'imap';

export class MailHelper {
  async getActivationLink(email) {
    return new Promise((resolve, reject) => {
      const imap = new Imap({
        user: 'dmitriiletob324@gmail.com',
        password: 'klju tyzu zhzr lqrb',
        host: 'imap.gmail.com',
        port: 993,
        tlsOptions: { rejectUnauthorized: false },
        tls: true
      });

      function openInbox(cb) {
        imap.openBox('INBOX', false, cb);
      }
      

      function checkEmailWithDelay(attempts, delay) {
        if (attempts === 0) {
          console.log('No more attempts. Exiting.');
          imap.end();
          reject(new Error('No unread emails found with specified subject.'));
          return;
        }

          imap.search(['UNSEEN', ['HEADER', 'SUBJECT', 'Email Confirmation']], function(err, results) {
            console.log(results)
            if (err) {
                console.error('Search error:', err);
                imap.end();
                return;
              }

              if (results.length === 0) {
                console.log('No unread emails with specified subject. Retrying...');
                setTimeout(() => checkEmailWithDelay(attempts - 1, delay), delay);
                return;
              }

              imap.addFlags(results, '\\Seen', (err) => {
                if (err) {
                  console.error('Error marking email as seen:', err);
                }
                })

            const f = imap.fetch(results, { bodies: '' });
            f.on('message', function(msg, seqno) {
              msg.on('body', function(stream, info) {
                simpleParser(stream, (err, parsed) => {
                  if (err) reject(err);
                  const activationLink = parsed.text.match(/https?:\/\/[^\s\]\["]+/g)[0];
                  console.log(activationLink)
                  resolve(activationLink);
                });
                
              });
            });
            f.once('error', function(err) {
              reject(err);
            });
            f.once('end', function() {
              imap.end();
            });
      });
    }
      imap.once('ready', function() {
        openInbox(function(err, box) {
          if (err) throw err;
          console.log('Connected to inbox');
          checkEmailWithDelay(5, 5000); // 5 attempts with 5 seconds delay
        });
      });

      imap.once('error', function(err) {
        reject(err);
      });

      imap.once('end', function() {
        console.log('Connection ended');
      });

      imap.connect();
    })
  }
}