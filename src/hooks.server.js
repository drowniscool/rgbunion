import { initializeLucia } from '$lib/server/auth'
import { dev } from '$app/environment'
import { D1Database$ } from 'cfw-bindings-wrangler-bridge'
import { drizzle } from 'drizzle-orm/d1'
import * as schema from '$lib/server/db/schema'

const getDevD1 = async (dbName) => {
	return new D1Database$(dbName)
}


export const handle = async ({ event, resolve }) => {
	// Initialize database
	if (dev) {
		event.locals.db = await getDevD1('DB')
	} else {
		event.locals.db = event.platform?.env?.DB
	}

	event.locals.DB = drizzle(event.locals.db, { schema })
	event.locals.lucia = initializeLucia(event.locals.db, event.platform?.env)

	// Handle session before resolving
	const lucia = event.locals.lucia
	const sessionId = event.cookies.get(lucia.sessionCookieName)

	if (!sessionId) {
		event.locals.user = null
		event.locals.session = null
	} else {
		const { session, user } = await lucia.validateSession(sessionId)
		if (session && session.fresh) {
			const sessionCookie = lucia.createSessionCookie(session.id)
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			})
		}

		if (!session) {
			const sessionCookie = lucia.createBlankSessionCookie()
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			})
		}

		event.locals.user = user
		event.locals.session = session
	}

	const shouldObfuscateLanding = (() => {
		const flagFromBindings = event.platform?.env?.OBFUSCATE_HOME;
		const flagFromProcess = typeof process !== 'undefined' ? process.env.OBFUSCATE_HOME : undefined;
		const flag = flagFromBindings ?? flagFromProcess;
		return event.url.pathname === '/' && String(flag).toLowerCase() === 'true';
	})();

	// Only resolve once
	const response = await resolve(event, {
		transformPageChunk: ({ html, done }) => {
			if (!shouldObfuscateLanding) {
				return html;
			}
			if (!done) return html;

			// Extract the DOCTYPE and preserve it
			const doctype = '<!DOCTYPE html>';
			if (html.startsWith(doctype)) {
				return doctype + obfuscateHtml(html.slice(doctype.length));
			}
			return obfuscateHtml(html);
		}
	});


	if (event.url.pathname.startsWith('/api')) {
		response.headers.append('Access-Control-Allow-Origin', `*`)
	}

	return response
}


/**
 * Main function to obfuscate HTML content
 */
function obfuscateHtml(html) {
	// Configuration
	const varName = 'rgbunion';    // Variable name for obfuscated content
	const funcName = 'catchmeifyoucan';      // Function name for decoder
	const divName = 'rgbunion';       // Div ID name (when using div method)
	const charactersPerLine = 111; // Characters per line (must be divisible by 3)

	if (charactersPerLine % 3 !== 0) {
		console.error('charactersPerLine must be divisible by 3');
		return html;
	}

	// Always use direct document.write method for better compatibility with Iconify
	const useDirectWrite = true; // Changed from random to always true

	let code, out;
	if (useDirectWrite) {
		// Method 1: Direct document.write
		code = `<script type="text/javascript">function ${funcName}(s){var i=0,out='';l=s.length;for(;i<l;i+=3){out+=String.fromCharCode(parseInt(s.substr(i,2),16));}document.write(out);}</script>`;
		out = `${funcName}(${varName});\n</script>`;
	} else {
		// Method 2: Use a div container
		code = `<script type="text/javascript">function ${funcName}(s){var i=0,out='';l=s.length;for(;i<l;i+=3){out+=String.fromCharCode(parseInt(s.substr(i,2),16));}document.getElementById('${divName}').innerHTML=out;}</script>`;
		out = `document.write('<div id=${divName}></div>');\n${funcName}(${varName});\n</script>`;
	}

	// Final output assembly
	let output = `<script type="text/javascript">/*\n`;
	output += dragonAsciiArt();
	output += ` */\n`;
	output += `document.write(unescape('${jsEscape(code)}'));\n`;
	output += `var ${varName}='';\n`;
	output += encodeHtml(html, varName, charactersPerLine);
	output += out;

	// Add noscript fallback
	const noscript = '<noscript><div style="color:white;background:red;padding:20px;text-align:center"><tt><strong><big>For functionality of this site it is necessary to enable JavaScript. <br><br> Here are the <a target="_blank"href="http://www.enable-javascript.com/" style="color:white">instructions how to enable JavaScript in your web browser</a>.</big></strong></tt></div></noscript>';

	return output + noscript;
}

/**
 * Encode HTML content to hex representation
 */
function encodeHtml(input, varName, charactersPerLine) {
	let out = '';

	// Convert each character to hex
	for (let i = 0; i < input.length; i++) {
		const charCode = input.charCodeAt(i);
		let hex = charCode.toString(16).toUpperCase();

		if (hex === '') {
			// Handle special characters
			const temp = encodeURIComponent(input[i]).replace('%', '');
			out += temp + '.';
		} else {
			// Ensure 2 characters for each hex value
			out += (hex.length === 1 ? '0' + hex : hex) + '.';
		}
	}

	// Handle special characters
	out = out.replace(/\+/g, '20.');
	out = out.replace(/_/g, '5F.');
	out = out.replace(/-/g, '2D.');

	// Split into chunks
	const chunks = [];
	for (let i = 0; i < out.length; i += charactersPerLine) {
		chunks.push(out.substring(i, i + charactersPerLine));
	}

	// Build the variable assignment
	return chunks.map(chunk => `${varName}+='${chunk}';\n`).join('');
}

/**
 * Escape JavaScript content
 */
function jsEscape(input) {
	let out = '';

	for (let i = 0; i < input.length; i++) {
		const charCode = input.charCodeAt(i);
		const hex = charCode.toString(16).toUpperCase();

		if (hex === '') {
			out += encodeURIComponent(input[i]);
		} else {
			out += '%' + (hex.length === 1 ? '0' + hex : hex);
		}
	}

	return out;
}

/**
 * ASCII art for obfuscated content
 */
function dragonAsciiArt() {
	return `\n
   
 ██▀███    ▄████  ▄▄▄▄    █    ██  ███▄    █  ██▓ ▒█████   ███▄    █ 
▓██ ▒ ██▒ ██▒ ▀█▒▓█████▄  ██  ▓██▒ ██ ▀█   █ ▓██▒▒██▒  ██▒ ██ ▀█   █ 
▓██ ░▄█ ▒▒██░▄▄▄░▒██▒ ▄██▓██  ▒██░▓██  ▀█ ██▒▒██▒▒██░  ██▒▓██  ▀█ ██▒
▒██▀▀█▄  ░▓█  ██▓▒██░█▀  ▓▓█  ░██░▓██▒  ▐▌██▒░██░▒██   ██░▓██▒  ▐▌██▒
░██▓ ▒██▒░▒▓███▀▒░▓█  ▀█▓▒▒█████▓ ▒██░   ▓██░░██░░ ████▓▒░▒██░   ▓██░
░ ▒▓ ░▒▓░ ░▒   ▒ ░▒▓███▀▒░▒▓▒ ▒ ▒ ░ ▒░   ▒ ▒ ░▓  ░ ▒░▒░▒░ ░ ▒░   ▒ ▒ 
  ░▒ ░ ▒░  ░   ░ ▒░▒   ░ ░░▒░ ░ ░ ░ ░░   ░ ▒░ ▒ ░  ░ ▒ ▒░ ░ ░░   ░ ▒░
  ░░   ░ ░ ░   ░  ░    ░  ░░░ ░ ░    ░   ░ ░  ▒ ░░ ░ ░ ▒     ░   ░ ░ 
   ░           ░  ░         ░              ░  ░      ░ ░           ░ 
                       ░                                             
   
   \n`;
}