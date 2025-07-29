import { dev } from '$app/environment';
// IP Addresses from Maya
const ipAddressesList = {
	sandbox: ['13.299.160.234', '3.1.199.75'],
	production: ['18.138.50.235', '3.1.207.200']
};
const ipAddresses = dev ? ipAddressesList.sandbox : ipAddressesList.production;

const verifyAddress = async (ip: string) => ipAddresses.includes(ip);
export default verifyAddress;
