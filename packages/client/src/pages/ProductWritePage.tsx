import React, { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import Text from "@base/Text";
import Input from "@base/Input";
import MapPinIcon from "@icons/MapPinIcon";
import { usePriceInput, useImageInput } from "@src/hooks";
import ProductWriteTitle from "@components/modules/ProductWriteTitle";
import ProductWriteImage from "@components/modules/ProductWriteImage";
import ProductWriteHeader from "@components/modules/ProductWriteHeader";
import { useMutation } from "@hooks/useMutation";
import { requestAddProduct } from "@src/apis/product";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@hooks/useQuery";
import { ICategory } from "types/category.type";
import { requestGetCategory } from "@src/apis/category";

const MAX_IMAGE_LIMIT = 10;

const ProductWritePage = () => {
  const navigation = useNavigate();
  const { price, priceString, setPriceString } = usePriceInput("");
  const { imgUrl, addImages, deleteImage } = useImageInput(MAX_IMAGE_LIMIT);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isValid, setIsValid] = useState<boolean>(false);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const { data: categories } = useQuery<ICategory[]>(["category"], requestGetCategory);
  const [mutate] = useMutation(requestAddProduct, {
    cacheClear: true,
    onSuccess() {
      moveToMainPage();
    },
  });

  useEffect(() => {
    checkValidate();
  }, [selectedCategory, imgUrl]);

  const moveToMainPage = () => {
    navigation("/main");
  };

  const onClickSubmitButton: React.FormEventHandler = (e) => {
    e.preventDefault();
    const title = titleRef.current?.value;
    const description = descriptionRef.current?.value;
    const sellerId = 1;
    const locationId = 2;
    const product = {
      title,
      description,
      imgUrl,
      price,
      sellerId,
      locationId,
      categoryName: selectedCategory,
    };

    mutate(product);
  };

  const onChangeImageInput: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const files = e.target.files;
    if (!files) return;

    addImages(files);
  };

  const onClickCategoryBtn: React.MouseEventHandler<HTMLInputElement> = (e) => {
    const value = e.currentTarget.value;
    setSelectedCategory(value);
  };

  const checkValidate = () => {
    const title = titleRef.current?.value;
    const description = descriptionRef.current?.value;
    const imageCount = imgUrl.length;

    if (title && selectedCategory && description && imageCount) setIsValid(true);
    else setIsValid(false);
  };

  return (
    <Container>
      <ProductWriteHeader isValid={isValid} onClick={onClickSubmitButton} />
      <Body>
        <ProductWriteImage
          images={imgUrl}
          deleteImage={deleteImage}
          onChange={onChangeImageInput}
        />
        <ProductWriteTitle
          categories={categories!}
          selectedCategory={selectedCategory}
          checkValidate={checkValidate}
          onClickCategoryBtn={onClickCategoryBtn}
          ref={titleRef}
        />
        <PriceSection>
          <Input
            iSize="lg"
            placeholder="가격(선택 사항)"
            value={priceString}
            onChange={({ target: { value } }) => setPriceString(value)}
          />
        </PriceSection>
        <StyledTextArea
          placeholder="게시글 내용을 작성해주세요"
          ref={descriptionRef}
          onBlur={checkValidate}
        />
      </Body>
      <Footer>
        <MapPinIcon />
        <Text size="sm">장곡동</Text>
      </Footer>
    </Container>
  );
};

const Container = styled.form`
  width: 100%;
  height: 100%;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.COLOR.WHITE};

  > header {
    button {
      svg path {
        stroke: ${({ theme }) => theme.COLOR.PRIMARY1};
      }

      &:disabled {
        cursor: default;
        svg path {
          stroke: ${({ theme }) => theme.COLOR.GRAY3};
        }
      }
    }
  }
`;

const Body = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
  flex-grow: 1;

  padding: 0 16px;
`;

const PriceSection = styled.section`
  padding: 24px 0;
  border-bottom: 1px solid ${({ theme }) => theme.COLOR.GRAY3};

  > input {
    border: solid 1px transparent;
    padding: 0;
  }
`;

const StyledTextArea = styled.textarea`
  flex-grow: 1;
  margin: 24px 0;
  font-size: 16px;
  padding: 8px 0;

  resize: none;
  outline: none;

  &:focus,
  :active {
    border: 1px solid ${({ theme }) => theme.COLOR.PRIMARY1};
    border-radius: 8px;
  }
`;

const Footer = styled.footer`
  position: sticky;
  display: flex;
  bottom: 0px;
  padding: 8px 0px 8px 16px;
  column-gap: 4px;

  border-top: 1px solid ${({ theme }) => theme.COLOR.GRAY3};

  > svg {
    width: 16px;
    height: 16px;
  }
`;

export default ProductWritePage;
