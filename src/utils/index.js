import Cookies from 'js-cookie';

export const utils = {
	getLocalStorageValue: (cname) => {
		const cookie = Cookies.get(cname);
		if (typeof cookie === 'undefined') {
			return null;
		} else {
			return cookie;
		}
	},
	setLocalStorageValue: (cname, cvalue, expires = 6) => {
		Cookies.set(cname, cvalue, { expires: expires });
		let cookie = {};
		cookie[cname] = cvalue;
		return cookie;
	},
	removeLocalStorageValue: (cname) => {
		Cookies.remove(cname);
		return null;
	},
};
