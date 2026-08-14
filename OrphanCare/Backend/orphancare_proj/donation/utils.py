# donation/utils.py
from django.core.mail import send_mail
from django.conf import settings
import logging

logger = logging.getLogger(__name__)


def safe_get(obj, attr, default="N/A"):
    try:
        return getattr(obj, attr, default) or default
    except Exception:
        return default


def send_donation_accepted_email(donation):
    """
    Sends confirmation email to donor when donation is accepted.
    Never raises.
    """

    donor = donation.donor
    orphanage = donation.orphanage

    donor_email = (
        safe_get(donor, "email")
        or safe_get(donor.user, "email")
        if hasattr(donor, "user")
        else None
    )

    if not donor_email or donor_email == "N/A":
        logger.warning("Accepted email skipped: donor email missing")
        return

    donor_name = safe_get(donor, "full_name", "Dear Donor")
    orphanage_name = (
        safe_get(orphanage, "orphanage_name")
        or safe_get(orphanage, "name")
        or "the orphanage"
    )

    item = donation.item_name or safe_get(donation.requirement, "item_name", "items")
    quantity = donation.quantity or "N/A"

    subject = "Thank You! Your Donation Has Been Received ❤️"

    message = f"""
Hello {donor_name},

We’re happy to inform you that your donation has been successfully received by {orphanage_name}.

Donation Details:
• Item: {item}
• Quantity: {quantity}

Your generosity is making a real difference in the lives of children.
Thank you for supporting OrphanCare Network 💙

Warm regards,
OrphanCare Network
"""

    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[donor_email],
            fail_silently=False,
        )
    except Exception as e:
        logger.error("Donation accepted email failed: %s", str(e))
