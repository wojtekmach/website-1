import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';

import BlogNavLink from 'components/pages/blog/blog-nav-link';
import LINKS from 'constants/links';
import DiscordIcon from 'icons/discord-sm.inline.svg';
import LinkedInIcon from 'icons/linkedin-sm.inline.svg';
import XIcon from 'icons/x.inline.svg';
import YouTubeIcon from 'icons/youtube-sm.inline.svg';

const Search = dynamic(() => import('components/shared/search/search'));

const socialLinks = [
  {
    name: 'X',
    url: LINKS.twitter,
    icon: XIcon,
  },
  {
    name: 'LinkedIn',
    url: LINKS.linkedin,
    icon: LinkedInIcon,
  },
  {
    name: 'YouTube',
    url: LINKS.youtube,
    icon: YouTubeIcon,
  },
  {
    name: 'Discord',
    url: LINKS.discord,
    icon: DiscordIcon,
  },
];

const Sidebar = ({ categories }) => {
  const allCategories = [
    {
      name: 'Featured',
      slug: 'all',
    },
    ...categories,
  ];
  return (
    <aside className="w-[192px] shrink-0 pb-10 lt:w-full lt:pb-0">
      <div className="relative flex h-full flex-col gap-y-10 lt:h-auto lt:min-h-fit">
        <div className="relative flex-1">
          <nav className="no-scrollbars sticky top-32 lt:flex lt:items-end lt:justify-between lt:pt-8 md:-mx-4 md:max-w-5xl md:overflow-auto md:px-4">
            <Search
              className="dark z-30 max-w-[152px] lt:order-1 lt:w-full lg:hidden"
              indexName={process.env.NEXT_PUBLIC_ALGOLIA_BLOG_INDEX_NAME}
              isBlog
            />
            <ul className="mt-8 flex flex-col gap-y-3.5 lt:mt-0 lt:flex-row lt:gap-x-7 md:after:shrink-0 md:after:grow-0 md:after:basis-px md:after:content-['']">
              {allCategories.map(({ name, slug }, index) => (
                <li key={index}>
                  <BlogNavLink name={name} slug={slug} />
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="sticky bottom-10 leading-none lt:hidden">
          <span className="text-xs font-semibold uppercase -tracking-extra-tight text-gray-new-70">
            Follow us
          </span>
          <ul className="mt-4 flex flex-wrap gap-4">
            {socialLinks.map(({ name, url, icon: Icon }, index) => (
              <li className="flex items-center" key={index}>
                <a
                  className="group flex items-center justify-center rounded-full"
                  aria-label={name}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon className="h-4 w-auto text-gray-new-70 transition-colors duration-200 group-hover:text-green-45" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

Sidebar.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      slug: PropTypes.string,
    })
  ).isRequired,
};
