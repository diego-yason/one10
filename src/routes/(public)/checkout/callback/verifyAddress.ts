import { dev } from '$app/environment';
import { PUBLIC_ENVIRONMENT } from '$env/static/public';
// IP Addresses from Maya
const ipAddressesList = {
	sandbox: ['13.299.160.234', '3.1.199.75'],
	production: ['18.138.50.235', '3.1.207.200']
};
const ipAddresses =
	PUBLIC_ENVIRONMENT === 'dev' ? ipAddressesList.sandbox : ipAddressesList.production;

// do not do anything if in dev server
const verifyAddress = async (ip: string) => ipAddresses.includes(ip) || dev;
export default verifyAddress;
