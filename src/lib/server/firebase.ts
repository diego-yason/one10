import firebase from 'firebase-admin';
import type { ServiceAccount } from 'firebase-admin/app';

import {
	firebase_admin_type,
	firebase_admin_project_id,
	firebase_admin_private_key_id,
	firebase_admin_private_key,
	firebase_admin_client_email,
	firebase_admin_client_id,
	firebase_admin_auth_uri,
	firebase_admin_token_uri,
	firebase_admin_auth_provider_x509_cert_url,
	firebase_admin_client_x509_cert_url,
	firebase_admin_universe_domain
} from '$env/static/private';

export const admin = firebase.initializeApp({
	credential: firebase.credential.cert({
		type: firebase_admin_type,
		projectId: firebase_admin_project_id,
		privateKeyId: firebase_admin_private_key_id,
		privateKey: firebase_admin_private_key.replace(/\\n/g, '\n'),
		clientEmail: firebase_admin_client_email,
		clientId: firebase_admin_client_id,
		authUri: firebase_admin_auth_uri,
		tokenUri: firebase_admin_token_uri,
		authProviderX509CertUrl: firebase_admin_auth_provider_x509_cert_url,
		clientX509CertUrl: firebase_admin_client_x509_cert_url,
		universeDomain: firebase_admin_universe_domain
	} as ServiceAccount)
});

console.log(firebase_admin_project_id + ' admin initialized');
export const adminDb = admin.firestore();
export const adminAuth = admin.auth();
