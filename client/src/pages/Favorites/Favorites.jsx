import React, { useState } from "react";
import { useQuery } from "react-query";
import { getAllUserFavourites, removeFromList } from "../../api/Favourite";
import { IMAGE_URL } from "../../constant/URL";
import { Link } from "react-router-dom";
import { Row, Col, Card, Button, Tag, message } from "antd";
import NoData from "../../components/NoData/NoData";
import Loading from './../../components/Loading/Loading';

function Favorites() {
  const { data, isLoading, error } = useQuery(["user", "favorites"], getAllUserFavourites);
  const [favoritesList, setFavoritesList] = useState([]);

  // When data is fetched, update the local state
  React.useEffect(() => {
    if (data) setFavoritesList(data);
  }, [data]);

  const handelRemoveFromFavorite = async (e, id) => {
    e.preventDefault();
    try {
      await removeFromList(id);
      message.success("تم مسح المنتج من المفضلة");
      // Remove the deleted item from the local state
      setFavoritesList((prevList) => prevList.filter((fav) => fav.id !== id));
    } catch (err) {
      message.error("حدث خطأ أثناء مسح المنتج من المفضلة");
    }
  };

  if (isLoading) return <div><Loading /></div>;
  if (error) return <div>Error loading favorites</div>;
  if (favoritesList.length <= 0)
    return (
      <div className="w-full h-screen">
        <NoData />
      </div>
    );

  return (
    <div className="container p-4 mx-auto">
      <h1 className="mb-6 text-3xl font-bold text-center">المنتجات المفضلة</h1>
      <Row gutter={[16, 16]}>
        {favoritesList.map((favorite) => (
          <Col key={favorite.id} xs={24} sm={12} lg={8}>
            <Card
              hoverable
              cover={
                <img
                  src={
                    IMAGE_URL +
                    "images/" +
                    favorite?.Product?.ProductImages[0].imageUrl
                  }
                  alt={favorite?.Product?.TradeName}
                  style={{ objectFit: 'contain', height: '200px' }}
                />
              }
              actions={[
                <Link
                  to="/product-detail"
                  state={{ product: favorite?.Product }}
                  className="ant-btn ant-btn-primary"
                >
                  تفاصيل المنتج
                </Link>,
                <Button danger onClick={(e) => handelRemoveFromFavorite(e, favorite.id)}>
                  مسح
                </Button>,
              ]}
            >
              <div className="flex justify-between">
                {favorite?.Product?.discountPercentage !== 0 && (
                  <Tag color="black">{favorite?.Product?.discountPercentage}% تخفيض</Tag>
                )}
                {favorite?.Product?.availability === false && (
                  <Tag color="red">غير متوفر</Tag>
                )}
              </div>
              <Card.Meta
                title={favorite?.Product?.TradeName}
                description={
                  <>
                    <div>
                      {favorite?.Product?.discountPercentage !== 0
                        ? (
                            favorite.Product.price - 
                            favorite.Product.price * (favorite.Product.discountPercentage / 100)
                          ).toFixed(0)
                        : favorite.Product.price}{" "}
                      د.ل
                      {favorite.Product.discountPercentage !== 0 && (
                        <span className="line-through text-slate-400">
                          {" "}{favorite.Product.price} د.ل
                        </span>
                      )}
                    </div>
                  </>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default Favorites;
