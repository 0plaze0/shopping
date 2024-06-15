import { SEO } from "../components";
import { useSearch } from "../context/search";

const Search = () => {
  const [value, setValue] = useSearch();

  return (
    <>
      <SEO title={`${value.keyword} product results`} />
      <div className="container">
        <div className="text-center">
          <h1>Search Product</h1>
          <h3>Found {value?.results.length}</h3>
        </div>
        <>
          {value?.results.map((product) => (
            <div
              className="card mb-1 "
              style={{ width: "18rem" }}
              key={product._id}
            >
              <img
                src={`${import.meta.env.VITE_API}api/v1/product/product-photo/${
                  product._id
                }`}
                className="card-img-top"
                alt="..."
              />
              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text">
                  {product.description.substring(0, 60)}
                </p>
                <p className="card-text">${product.price}</p>
                <button className="btn btn-primary ms-1">More Details</button>
                <button className="btn btn-secondary ms-1">Add to Cart</button>
              </div>
            </div>
          ))}
        </>
      </div>
    </>
  );
};

export default Search;
