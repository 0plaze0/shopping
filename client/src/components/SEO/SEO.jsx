import { Helmet } from "react-helmet";

const SEO = ({
  title = "Ecommerce app",
  description = "Buy Your Favourite Product",
  keywords = "shopping, buy, discount",
  author = "akash",
}) => {
  return (
    <Helmet>
      <meta charSet="UTF-8" />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <title>{title}</title>
    </Helmet>
  );
};

export default SEO;
