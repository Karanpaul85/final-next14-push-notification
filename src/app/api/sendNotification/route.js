import admin from "firebase-admin";
import { NextResponse } from "next/server";
// import serviceAccount from "../../lib/serviceAccountKey.json"; // Adjust the path as necessary

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      type: process.env.TYPE,
      project_id: process.env.PROJECT_ID,
      private_key_id: process.env.PRIVATE_KEY_ID,
      private_key: process.env.PRIVATE_KEY.replace(/\\n/g, "\n"), // Ensure newlines are handled correctly
      client_email: process.env.CLIENT_EMAIL,
      client_id: process.env.CLIENT_ID,
      auth_uri: process.env.AUTH_URI,
      token_uri: process.env.TOKEN_URI,
      auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
      client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
      universe_domain: process.env.UNIVERSE_DOMAIN,
    }),
  });
}

export async function POST(req) {
  const { token, title, body, image, click_action } = await req.json();

  try {
    const message = {
      token,
      // notification: {
      //   title,
      //   body,
      //   image,
      //   // icon: image || "/favicon.ico", // Fallback icon
      // },
      data: {
        click_action,
        image,
        body,
        title,
      },
      webpush: {
        notification: {
          title,
          body,
          image,
          icon: image,
          badge: "/favicon.ico",
          click_action,
        },
        fcmOptions: {
          link: click_action,
        },
      },
    };

    const response = await admin.messaging().send(message);
    return NextResponse.json({ success: true, messageId: response });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: error.message });
  }
}
