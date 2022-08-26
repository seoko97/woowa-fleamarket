import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import styled from "@emotion/styled";
import MainHeader from "@components/modules/MainHeader";
import ProductItem from "@components/modules/ProductItem";
import MapPinIcon from "@icons/MapPinIcon";
import Text from "@base/Text";
import Fab from "@base/Fab";
import auth from "@hoc/auth";

import { requestGetProducts } from "@apis/product";

import { useQuery } from "@hooks/useQuery";
import { useSearchParam } from "@hooks/useSearchParam";
import { IProductItem } from "types/product.type";
import { requestGetLoginUserInfo } from "@apis/auth";
import { IUser } from "types/user.type";

const MainPage = auth(() => {
  const navigation = useNavigate();
  const params = useSearchParam();
  const [products, setProducts] = useState<IProductItem[]>();
  const { refetch } = useQuery(["products"], requestGetProducts, {
    onSuccess(data) {
      setProducts(data);
    },
  });
  const { data: user } = useQuery(["userinfo"], requestGetLoginUserInfo);

  const moveToLocationPage = () => {
    navigation("/location");
  };

  const moveToProductWritePage = () => {
    navigation("/product/write");
  };

  const getActiveLocation = (user: IUser) => {
    const locations = user.locations;
    return locations.filter(({ isActive }) => isActive)[0];
  };

  useEffect(() => {
    if (!user) return;
    const activeLocation = getActiveLocation(user);

    if (params.category) {
      refetch({ category: params.category, location: activeLocation.id });
    } else {
      refetch({ location: activeLocation.id });
    }
  }, [params.category, user]);

  return (
    <>
      <Container>
        <MainHeader>
          <button onClick={moveToLocationPage}>
            <MapPinIcon />
            <Text size="lg" fColor="WHITE">
              {user && getActiveLocation(user).dong}
            </Text>
          </button>
        </MainHeader>
        <ProductList>
          {products &&
            products.map((product) => (
              <ProductItem key={product.id} product={product} isActive={true} />
            ))}
        </ProductList>
        <Layer>
          <Fab onClick={moveToProductWritePage} />
        </Layer>
      </Container>
    </>
  );
});

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.COLOR.WHITE};
`;

const Layer = styled.div`
  position: absolute;
  right: 0px;
  bottom: 0px;
  z-index: 1;
`;

const ProductList = styled.div`
  overflow: auto;
`;

export default MainPage;
