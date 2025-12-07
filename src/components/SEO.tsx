import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * SEO Configuration per route
 */
interface SEOConfig {
    title: string;
    description: string;
    ogImage?: string;
}

const BASE_URL = 'https://orign8.ai';
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.png`;

/**
 * Route-specific SEO metadata
 */
const routeSEO: Record<string, SEOConfig> = {
    '/': {
        title: 'Orign8 | Mortgage Tech Voice AI',
        description: 'Orign8 deploys hyper-realistic Voice AI agents that handle mortgage lead outreach, qualification, and appointment setting at scale. Built by lenders, for lenders.',
    },
    '/product': {
        title: 'Product | Orign8 Voice AI Platform',
        description: 'Enterprise-grade queue processing with TCPA compliance, smart retries, and Total Expert CRM integration. The complete origination engine for mortgage lenders.',
    },
    '/about': {
        title: 'About | Orign8',
        description: 'Learn about Orign8, the team building Voice AI solutions for the mortgage industry. Our mission is to help lenders scale without scaling headcount.',
    },
    '/contact': {
        title: 'Contact | Get Started with Orign8',
        description: 'Book a demo and see how Orign8 Voice AI can transform your mortgage lead management. Discovery call, integration setup, and launch in days.',
    },
    '/privacy': {
        title: 'Privacy Policy | Orign8',
        description: 'Learn how Orign8 collects, uses, and protects your personal information. Our commitment to data security and TCPA compliance.',
    },
};

const defaultSEO: SEOConfig = {
    title: 'Orign8 | Mortgage Tech Voice AI',
    description: 'Hyper-realistic Voice AI agents for mortgage lead outreach and appointment setting.',
};

/**
 * Updates document meta tags for SEO
 */
function updateMetaTag(name: string, content: string, isProperty = false): void {
    const attribute = isProperty ? 'property' : 'name';
    let element = document.querySelector(`meta[${attribute}="${name}"]`);

    if (element) {
        element.setAttribute('content', content);
    } else {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        element.setAttribute('content', content);
        document.head.appendChild(element);
    }
}

/**
 * Updates canonical link
 */
function updateCanonical(url: string): void {
    let link = document.querySelector('link[rel="canonical"]');

    if (link) {
        link.setAttribute('href', url);
    } else {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        link.setAttribute('href', url);
        document.head.appendChild(link);
    }
}

/**
 * SEO Component - Updates meta tags based on current route
 * Place this component inside your Router
 */
export const SEO: React.FC = () => {
    const location = useLocation();

    useEffect(() => {
        const config = routeSEO[location.pathname] || defaultSEO;
        const currentUrl = `${BASE_URL}${location.pathname}`;
        const ogImage = config.ogImage || DEFAULT_OG_IMAGE;

        // Update document title
        document.title = config.title;

        // Update meta description
        updateMetaTag('description', config.description);

        // Update Open Graph tags
        updateMetaTag('og:title', config.title, true);
        updateMetaTag('og:description', config.description, true);
        updateMetaTag('og:url', currentUrl, true);
        updateMetaTag('og:image', ogImage, true);

        // Update Twitter tags
        updateMetaTag('twitter:title', config.title);
        updateMetaTag('twitter:description', config.description);
        updateMetaTag('twitter:url', currentUrl);
        updateMetaTag('twitter:image', ogImage);

        // Update canonical
        updateCanonical(currentUrl);

    }, [location.pathname]);

    return null;
};

export default SEO;
