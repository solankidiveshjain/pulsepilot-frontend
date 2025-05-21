import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";

const window = new JSDOM("").window;
const purify = DOMPurify(window);

interface SanitizeOptions {
  allowedTags?: string[];
  allowedAttributes?: Record<string, string[]>;
  allowedSchemes?: string[];
}

const defaultOptions: SanitizeOptions = {
  allowedTags: [
    "b",
    "i",
    "em",
    "strong",
    "a",
    "p",
    "br",
    "ul",
    "ol",
    "li",
    "blockquote",
    "code",
    "pre",
  ],
  allowedAttributes: {
    a: ["href", "target", "rel"],
    img: ["src", "alt"],
  },
  allowedSchemes: ["http", "https", "mailto", "tel"],
};

export function sanitizeHtml(html: string, options: SanitizeOptions = {}): string {
  const mergedOptions = {
    ...defaultOptions,
    ...options,
  };

  return purify.sanitize(html, {
    ALLOWED_TAGS: mergedOptions.allowedTags,
    ALLOWED_ATTR: mergedOptions.allowedAttributes,
    ALLOWED_SCHEMES: mergedOptions.allowedSchemes,
  });
}
