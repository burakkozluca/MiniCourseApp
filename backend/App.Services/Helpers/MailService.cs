using System.Text;
using MailKit.Net.Smtp;
using MimeKit;
using MimeKit.Text;

namespace App.Services.Helpers;

public class MailService
{
    private readonly string _smtpServer;
    private readonly int _smtpPort;
    private readonly string _smtpUser;
    private readonly string _smtpPass;

    public MailService(string smtpServer, int smtpPort, string smtpUser, string smtpPass)
    {
        _smtpServer = smtpServer;
        _smtpPort = smtpPort;
        _smtpUser = smtpUser;
        _smtpPass = smtpPass;
    }

    public async Task SendEmailAsync(string to, string subject, string body, bool isHtml = true)
    {
        var email = new MimeMessage();
        email.From.Add(MailboxAddress.Parse(_smtpUser));
        email.To.Add(MailboxAddress.Parse(to));
        email.Subject = subject;
        email.Body = new TextPart(isHtml ? TextFormat.Html : TextFormat.Plain)
        {
            Text = body
        };

        using var smtp = new SmtpClient();
        try
        {
            await smtp.ConnectAsync(_smtpServer, _smtpPort, MailKit.Security.SecureSocketOptions.StartTls);
            await smtp.AuthenticateAsync(_smtpUser, _smtpPass);
            await smtp.SendAsync(email);
        }
        finally
        {
            await smtp.DisconnectAsync(true);
        }
    }

    public async Task SendPasswordResetEmailAsync(string to, string resetLink)
    {
        string subject = "Password Reset Request";
        string body = $@"
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset='UTF-8'>
            <meta name='viewport' content='width=device-width, initial-scale=1.0'>
            <title>Password Reset</title>
            <style>
                body {{
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    margin: 0;
                    padding: 0;
                    background-color: #f4f4f4;
                }}
                .container {{
                    max-width: 600px;
                    margin: 20px auto;
                    padding: 20px;
                    background-color: #ffffff;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }}
                .header {{
                    text-align: center;
                    padding: 20px 0;
                    border-bottom: 2px solid #f0f0f0;
                }}
                .logo {{
                    color: #a435f0;
                    font-size: 24px;
                    font-weight: bold;
                    text-decoration: none;
                }}
                .content {{
                    padding: 30px 20px;
                }}
                h1 {{
                    color: #1c1d1f;
                    font-size: 24px;
                    margin-bottom: 20px;
                    text-align: center;
                }}
                p {{
                    margin-bottom: 15px;
                    color: #6a6f73;
                }}
                .reset-button {{
                    display: inline-block;
                    padding: 12px 24px;
                    background-color: #a435f0;
                    color: #ffffff !important;
                    text-decoration: none;
                    border-radius: 4px;
                    font-weight: 600;
                    margin: 20px 0;
                    text-align: center;
                }}
                .reset-button:hover {{
                    background-color: #8710d8;
                }}
                .footer {{
                    text-align: center;
                    padding-top: 20px;
                    border-top: 2px solid #f0f0f0;
                    font-size: 12px;
                    color: #6a6f73;
                }}
                .warning {{
                    background-color: #fff3cd;
                    border: 1px solid #ffeeba;
                    color: #856404;
                    padding: 12px;
                    border-radius: 4px;
                    margin-top: 20px;
                    font-size: 14px;
                }}
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <a href='#' class='logo'>MiniUdemy</a>
                </div>
                <div class='content'>
                    <h1>Password Reset Request</h1>
                    <p>Hello,</p>
                    <p>We received a request to reset your password. Don't worry, we're here to help!</p>
                    <p>Click the button below to reset your password:</p>
                    <div style='text-align: center;'>
                        <a href='{resetLink}' class='reset-button' target='_blank'>Reset Password</a>
                    </div>
                    <div class='warning'>
                        <strong>Note:</strong> This link will expire in 24 hours for security reasons.
                        If you didn't request this password reset, please ignore this email.
                    </div>
                </div>
                <div class='footer'>
                    <p>This email was sent by MiniUdemy. Please do not reply to this email.</p>
                    <p>&copy; {DateTime.Now.Year} MiniUdemy. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>";

        await SendEmailAsync(to, subject, body, isHtml: true);
    }
}