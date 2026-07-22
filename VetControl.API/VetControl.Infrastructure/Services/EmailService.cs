using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using Microsoft.Extensions.Configuration;
using VetControl.Application.Interfaces;

namespace VetControl.Infrastructure.Services;

public class EmailService : IEmailService
{
    private readonly IConfiguration _configuration;

    public EmailService(
        IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public async Task SendEmailAsync(
        string to,
        string subject,
        string body)
    {
        var emailAddress =
            _configuration["EmailSettings:Email"]
            ?? throw new Exception(
                "No se configuró EmailSettings:Email");

        var password =
            _configuration["EmailSettings:Password"]
            ?? throw new Exception(
                "No se configuró EmailSettings:Password");

        var host =
            _configuration["EmailSettings:Host"]
            ?? throw new Exception(
                "No se configuró EmailSettings:Host");

        var port =
            int.Parse(
                _configuration["EmailSettings:Port"]
                ?? throw new Exception(
                    "No se configuró EmailSettings:Port"));

        var email = new MimeMessage();

        email.From.Add(
            MailboxAddress.Parse(
                emailAddress));

        email.To.Add(
            MailboxAddress.Parse(
                to));

        email.Subject = subject;

        email.Body = new TextPart("plain")
        {
            Text = body
        };

        using var smtp = new SmtpClient();

        smtp.ServerCertificateValidationCallback =
            (_, _, _, _) => true;

        await smtp.ConnectAsync(
            host,
            port,
            SecureSocketOptions.StartTls);

        await smtp.AuthenticateAsync(
            emailAddress,
            password);

        await smtp.SendAsync(
            email);

        await smtp.DisconnectAsync(
            true);
    }
}