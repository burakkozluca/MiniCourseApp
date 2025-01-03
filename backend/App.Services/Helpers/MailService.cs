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
        <h1>Password Reset Request</h1>
        <p>We received a request to reset your password. Click the link below to reset it:</p>
        <p><a href='{resetLink}' target='_blank'>Reset Password</a></p>
        <p>If you didn't request this, please ignore this email.</p>";

        await SendEmailAsync(to, subject, body, isHtml: true);
    }
}