# auth_app/utils.py
from django.core.mail import send_mail
from django.conf import settings
import logging


def send_otp_email(to_email, otp_code):
    subject = "Your OrphanCare Verification OTP"
    message = f"""
    Welcome to OrphanCare! 
    Your OTP code for account verification is: {otp_code}

    This code will expire in 10 minutes.

    If you did not request this, please ignore this email.
    """
    send_mail(
        subject=subject,
        message=message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[to_email],
        fail_silently=False,
    )



logger = logging.getLogger(__name__)


def safe_get(obj, attr, default="N/A"):
    try:
        return getattr(obj, attr, default) or default
    except Exception:
        return default


def send_donation_created_email(
    orphanage,
    donor,
    donation,
):
    """
    Best-effort email sender.
    Never raises.
    """

    orphanage_email = (
        safe_get(orphanage, "email")
        or safe_get(orphanage.user, "email")
        if hasattr(orphanage, "user")
        else None
    )

    # If no email → silently skip
    if not orphanage_email or orphanage_email == "N/A":
        logger.warning("Donation email skipped: orphanage email missing")
        return

    orphanage_name = (
        safe_get(orphanage, "name")
        or safe_get(orphanage, "orphanage_name")
        or "Orphanage"
    )

    donor_name = safe_get(donor, "full_name", "A donor")

    subject = "New Donation Request Raised"

    message = f"""
Hello {orphanage_name},

A new donation request has been raised on OrphanCare.

Donor Name: {donor_name}
Item: {donation.item_name or "N/A"}
Quantity: {donation.quantity or "N/A"}
Details: {donation.description or "N/A"}

Please log in to OrphanCare to review this donation.

— OrphanCare Network
"""

    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[orphanage_email],
            fail_silently=False,
        )
    except Exception as e:
        logger.error("Donation email failed: %s", str(e))
