import { DATE_FORMAT, FILE_TYPE, LIBRARY_FILE_TYPE } from "./AppEnumerations";
import { TDateFormat } from "../data/AppType";
import CryptoJS from "crypto-js";
import ICToastmessage from "../core-component/ICToastmessage";
import { localStorageUtils } from "./LocalStorageUtil";
import { APP_HOST_URL, PUBLIC_KEY } from "../config/AppConfig";
import { FormikErrors, FormikTouched } from "formik";
import { NavigateFunction } from "react-router-dom";
import ICSweetAlert from "../components/common/SweetAlert";
import { IItemPagination, IPaginationApi } from "../data/AppInterface";
import { monthNames } from "./AppConstants";
import Swal from "sweetalert2";
import forge from "node-forge";
import { unauthorizedAccess } from "../routes/RoutePublic";

// Region Date And Time
export const convertUTCToTime = (
  utcTime: Date,
  offset: number,
  format?: TDateFormat
) => {
  const newTime = new Date(utcTime.getTime() + offset * 60 * 1000);

  if (format) {
    return dateFormat(newTime);
  }

  return newTime;
};

export const convertTimeStringToTime = (timeString: string) => {
  const [hours, minutes, seconds] = timeString.split(":").map(Number);
  const time = getLocalDate();
  time.setHours(hours);
  time.setMinutes(minutes);
  time.setSeconds(seconds);

  let formattedHours = time.getHours();
  const formattedMinutes = String(time.getMinutes()).padStart(2, "0");
  const period = formattedHours >= 12 ? "PM" : "AM";

  formattedHours = formattedHours % 12 || 12;
  const formattedHourString = String(formattedHours).padStart(2, "0");

  const formattedTime = `${formattedHourString}:${formattedMinutes} ${period}`;
  return formattedTime;
};

export const dateFormat = (
  date: Date,
  format: TDateFormat = DATE_FORMAT["DD-Mon-YYYY"]
) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  switch (format) {
    case DATE_FORMAT["DD-MM-YYYY"]:
      return `${day}-${month}-${year}`;
    case DATE_FORMAT["MM-DD-YYYY"]:
      return `${month}-${day}-${year}`;
    case DATE_FORMAT["DD-Mon-YYYY"]:
      return `${day}-${monthNames[date.getMonth()]}-${year}`;
    case DATE_FORMAT["YYYY-MM-DD"]:
      return `${year}-${month}-${day}`;
  }
};

// EndRegion
export const getLocalDate = (objPar?: string | number | Date) => {
  if (objPar) {
    return new Date(objPar);
  } else {
    return new Date();
  }
};
// Region Currency

export const getRelativeTime = (publishDate: string) => {
  const currentDate = getLocalDate();
  const postDate = getLocalDate(publishDate);

  const difference = currentDate.getTime() - postDate.getTime();
  const minutes = Math.floor(difference / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);

  if (months > 0) {
    return `${months} month${months > 1 ? "s" : ""} ago`;
  } else if (days > 0) {
    return `${days} day${days > 1 ? "s" : ""} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else {
    return `${minutes} min`;
  }
};

export const getTimeOrDate = (date: Date): string => {
  const currentDate = new Date();
  const millisecondsPerDay = 24 * 60 * 60 * 1000;

  const differenceInMilliseconds = currentDate.getTime() - date.getTime();

  if (differenceInMilliseconds < millisecondsPerDay) {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  } else {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString().slice(-2);
    return `${day}-${month}-${year}`;
  }
};

export const generatePaginationFromApiRes = (
  objPagination: IItemPagination
) => {
  const pagination: IPaginationApi = {
    total_page: objPagination.totalPages,
    total_count: objPagination.totalItems,
    per_page_rows: objPagination.perPageRows,
    current_page: objPagination.currentPage,
  };
  return pagination;
};

export const resetPaginationWithPpr = (perPageRows: number) => {
  return {
    total_page: 0,
    total_count: 0,
    per_page_rows: perPageRows,
    current_page: 1,
  };
};

export default function formatMoneyWithExchange(
  amount: number,
  targetCurrency?: string
): string {
  const formatter = new Intl.NumberFormat("USD", {
    style: "currency",
    currency: "USD",
  });

  return formatter.format(amount);
}

export function formatPohneNumber(
  phoneNumber: string,
  countryCode: string = "US"
): string {
  switch (countryCode) {
    case "US":
      // Format US phone number as (XXX) XXX-XXXX
      return phoneNumber.replace(/^(\d{3})(\d{3})(\d{4})$/, "($1) $2-$3");
    case "IN":
      // Format India phone number as +91 XXXXX-XXXXX
      return phoneNumber.replace(/^(\d{5})(\d{5})$/, "+91 $1-$2");
    case "CA":
      // Format Canada phone number as XXX-XXX-XXXX
      return phoneNumber.replace(/^(\d{3})(\d{3})(\d{4})$/, "$1-$2-$3");
    default:
      return phoneNumber; // Return unformatted number if country code is not recognized
  }
}

// region end phone format

// Region   Tost Message

const toastSuccess = (
  message: string,
  duration?: number,
  position?: string
) => {
  ICToastmessage("success", message, duration, position);
};

const toastError = (message: string, duration?: number, position?: string) => {
  ICToastmessage("error", message, duration, position);
};

const toastWarning = (
  message: string,
  duration?: number,
  position?: string
) => {
  ICToastmessage("warning", message, duration, position);
};

const toastInfo = (message: string, duration?: number, position?: string) => {
  ICToastmessage("info", message, duration, position);
};

export { toastSuccess, toastError, toastWarning, toastInfo };

// Region End TostMessage

// Region ClearSession

export const clearSession = () => {
  localStorageUtils.removeAll();
};
// Region End ClearSession

export const generateKeys = (publicKey: string) => {
  // CRYPTO_CIPHER_KEY
  const cipherKey = CryptoJS.SHA256(publicKey + "cipherKey")
    .toString(CryptoJS.enc.Base64)
    .slice(0, 32);

  // CRYPTO_CIPHER_IV
  const cipherIV = CryptoJS.SHA256(publicKey + "cipherIV")
    .toString(CryptoJS.enc.Base64)
    .slice(0, 32);

  // SECRET_KEY
  const secretKey = CryptoJS.SHA256(publicKey + "secretKey")
    .toString(CryptoJS.enc.Base64)
    .slice(0, 32);

  return {
    cryptoCipherKey: cipherKey,
    cryptoCipherIV: cipherIV,
    secretKey: secretKey,
  };
};

export const encryptCrypto = (data: object): string => {
  try {
    const text = JSON.stringify(data);

    // Convert the PEM Public Key to a Forge RSA public key
    const publicKey = forge.pki.publicKeyFromPem(PUBLIC_KEY);

    // Encrypt the data
    const encrypted = publicKey.encrypt(text, "RSA-OAEP", {
      md: forge.md.sha256.create(), // Use SHA-256 hash function
    });

    // Encode the encrypted data as Base64
    return forge.util.encode64(encrypted);
  } catch (e) {
    throw e;
  }
};

const getParsedCryptoKey = (): {
  cryptoCipherKey: string;
  cryptoCipherIV: string;
} | null => {
  const cryptoCipherKey = localStorageUtils.getCryptoKey();
  if (cryptoCipherKey) {
    return JSON.parse(cryptoCipherKey);
  }
  return null;
};

export const encryptData = (text: string): string => {
  try {
    const parseCipherKey = getParsedCryptoKey();
    if (!parseCipherKey) {
      window.location.href = `${APP_HOST_URL}/${unauthorizedAccess.unauthorizedAccess}`;
      new Promise((res, rej) => setTimeout(res, 1000));
      return "";
    }

    const encryptedText = CryptoJS.AES.encrypt(
      text,
      parseCipherKey.cryptoCipherKey,
      {
        iv: CryptoJS.enc.Hex.parse(parseCipherKey.cryptoCipherIV),
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC,
      }
    ).toString();

    return (
      CryptoJS.enc.Hex.stringify(CryptoJS.enc.Utf8.parse(encryptedText)) || ""
    );
  } catch (e) {
    return "";
  }
};

export const decryptData = (text: string): string => {
  try {
    const parseCipherKey = getParsedCryptoKey();

    if (!parseCipherKey) {
      window.location.href = `${APP_HOST_URL}/${unauthorizedAccess.unauthorizedAccess}`;
      new Promise((res, rej) => setTimeout(res, 1000));
      return "";
    }

    const decryptedText = CryptoJS.AES.decrypt(
      CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Hex.parse(text)),
      parseCipherKey.cryptoCipherKey,
      {
        iv: CryptoJS.enc.Hex.parse(parseCipherKey.cryptoCipherIV),
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC,
      }
    ).toString(CryptoJS.enc.Utf8);

    return decryptedText || "";
  } catch (e) {
    window.location.href = `${APP_HOST_URL}/${unauthorizedAccess.unauthorizedAccess}`;
    new Promise((res, rej) => setTimeout(res, 1000));
    return "";
  }
};

export const prepareMessageFromParams = (
  message: string,
  params: [string, string][]
) => {
  let resultMessage = message;
  for (const [key, value] of params) {
    resultMessage = resultMessage.replaceAll("<<" + key + ">>", value);
  }
  return resultMessage;
};

export const getForikErrorMessage = <T extends Object>(
  errors: FormikErrors<T>,
  touched: FormikTouched<T>,
  name: keyof T
) => {
  let errorMessage;
  if (touched[name] && errors[name]) {
    errorMessage = errors[name];
  }
  if (!errorMessage) {
    return "";
  }
  if (typeof errorMessage === "string") {
    return errorMessage;
  }
  return "";
};

export const hasAnyModification = <T extends Object>(
  object: T,
  objectToCompare: T
) => {
  let hasChanges = false;
  let key: keyof T;
  for (key in object) {
    if (object[key] !== objectToCompare[key]) {
      hasChanges = true;
      break;
    }
  }
  return hasChanges;
};

export const navigationApp = (navigate: NavigateFunction, url: string) => {
  // Your navigation logic here
  navigate(url);
};

export const sweetAlertSuccess = (message: string) => {
  const type = "success";
  ICSweetAlert({ type, message });
};
export const sweetAlertError = (message: string) => {
  const type = "error";
  ICSweetAlert({ type, message });
  return null; // Return null, as we're displaying the error message using SweetAlert
};

export const sweetAlertInfo = (message: string) => {
  const type = "info";
  ICSweetAlert({ type, message });
};

export function arraysAreEqual<T>(arr1: T[], arr2: T[]): boolean {
  if (arr1.length !== arr2.length) {
    return false;
  }

  // Sort arrays to ensure order doesn't affect equality
  const sortedArr1 = [...arr1].sort();
  const sortedArr2 = [...arr2].sort();

  // Compare each element in the arrays
  for (let i = 0; i < sortedArr1.length; i++) {
    if (JSON.stringify(sortedArr1[i]) !== JSON.stringify(sortedArr2[i])) {
      return false;
    }
  }

  return true;
}

export const trailingDotAddition = (str: string, len: number) => {
  return str.length > len ? str.substring(0, len) + "..." : str;
};
export const isMobileDevice = () => {
  return window.innerWidth < 768;
};

export const getStarColors = (rating: number) => {
  switch (rating) {
    case 5:
      return "bg-green-900";
    case 4:
      return "bg-green-600";
    case 3:
      return "bg-yellow-400";
    case 2:
      return "bg-orange-400";
    case 1:
      return "bg-orange-600";
    default:
      return "bg-white";
  }
};

export const removeRouteInitial = (route: string) => {
  return route.replace("/", "");
};

export const calculateDaysLeft = (scheduleDateStr: string): number => {
  const scheduleDateTime: Date = getLocalDate(scheduleDateStr);
  const currentDate: Date = getLocalDate();

  const differenceMs: number =
    scheduleDateTime.getTime() - currentDate.getTime();
  const daysLeft: number = Math.ceil(differenceMs / (1000 * 60 * 60 * 24));
  return daysLeft;
};

export const updateRootStyles = (property: string, value: string) => {
  // Retrieve the root element
  const root = document.documentElement;
  // Set the value of the CSS variable
  root.style.setProperty(property, value);
};

export function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export const calculateTotalAmount = (
  price: string,
  discountPrice: string | null,
  transactionCharge: string | null,
  tax: string | null
): number => {
  const priceAmount = discountPrice
    ? parseFloat(discountPrice)
    : parseFloat(price);
  const chargeAmount = transactionCharge ? parseFloat(transactionCharge) : 0;
  const taxAmount = tax ? parseFloat(tax) : 0;
  return priceAmount + chargeAmount + taxAmount;
};

export const formatToCurrency = (number: number) => {
  const numberStr = number.toString().split(".");
  const integerPart = numberStr[0];
  const decimalPart = numberStr.length > 1 ? "." + numberStr[1] : "";

  let lastThreeDigits = integerPart.slice(-3);
  const otherDigits = integerPart.slice(0, -3);

  if (otherDigits !== "") {
    lastThreeDigits = "," + lastThreeDigits;
  }

  let formattedNumber =
    otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ",") +
    lastThreeDigits +
    decimalPart;

  return formattedNumber;
};

export const addCurrencySign = (value: number | string) => {
  return "₹" + value;
};

export const handleLibraryFileType = (fileType: number) => {
  switch (fileType) {
    case LIBRARY_FILE_TYPE.Pdf:
      return FILE_TYPE.PDF;
    case LIBRARY_FILE_TYPE.Image:
      return FILE_TYPE.IMAGE;
    case LIBRARY_FILE_TYPE.Video:
      return FILE_TYPE.VIDEO;
    case LIBRARY_FILE_TYPE.Audio:
      return FILE_TYPE.AUDIO;
    default:
      return FILE_TYPE.DIRECTORY;
  }
};

export const scrollRight = (
  ref: React.RefObject<HTMLDivElement>,
  scroll: number
) => {
  if (ref.current) {
    ref.current.scrollBy({
      left: scroll,
      behavior: "smooth",
    });
  }
};

export const scrollLeft = (
  ref: React.RefObject<HTMLDivElement>,
  scroll: number
) => {
  if (ref.current) {
    ref.current.scrollBy({
      left: -scroll,
      behavior: "smooth",
    });
  }
};

export const financialStr = (value: number) => {
  return value.toFixed(2);
};

export const prepareUserId = (type: string, id: string): string => {
  // Pad the id with leading zeros to ensure it is at least 9 characters long
  const paddedId = id.padStart(9, "0");

  // Concatenate the type with the padded id
  const result = `${type}${paddedId}`;

  return result;
};

export const handleNumericInput = (
  event: React.ChangeEvent<HTMLInputElement>
) => {
  const { value } = event.target;
  const numericValue = value.replace(/\D/g, ""); // Remove non-numeric characters
  event.target.value = numericValue;
};

export const ensureHttpsUrl = (url: string): string => {
  if (!/^https?:\/\//i.test(url)) {
    // If not, add 'https://'
    return `https://${url}`;
  }
  return url;
};

export const initMetaPixel = () => {
  if (!(window as any).fbq) {
    (function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
      if ((f as any).fbq) return;
      n = (f as any).fbq = function () {
        n.callMethod
          ? n.callMethod.apply(n, arguments)
          : n.queue.push(arguments);
      };
      if (!(f as any)._fbq) (f as any)._fbq = n;
      n.push = n;
      n.loaded = true;
      n.version = "2.0";
      n.queue = [];
      t = b.createElement(e);
      t.async = true;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(
      window,
      document,
      "script",
      "https://connect.facebook.net/en_US/fbevents.js"
    );

    (window as any).fbq("init", "391882840557219");
    (window as any).fbq("track", "PageView");
  }
};

interface IConfirmationDialog {
  title: string;
  text?: string;
  onConfirm?: () => void;
  buttonText: string;
}

export const showConfirmationDialog = ({
  title,
  text,
  onConfirm,
  buttonText,
}: IConfirmationDialog) => {
  Swal.fire({
    title,
    text: text || "",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: buttonText,
  }).then((result) => {
    if (result.isConfirmed && onConfirm) {
      onConfirm();
    }
  });
};
