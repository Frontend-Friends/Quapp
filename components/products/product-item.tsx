import { Box, Button, Card, CardContent, CardMedia, Modal, Typography } from "@mui/material";
import { FC, useState } from "react";
import { useTranslation } from "../../hooks/use-translation";
import Link from "next/link";
import { ProductType } from "./types";
import { useRouter } from "next/router";
import { ProductMenu } from "./product-menu";
import { CondensedContainer } from "../condensed-container";
import { User } from "../user/types";


const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  m: 0,
  p: 4,
  borderRadius: 2
};

export const ProductItem: FC<{
  product: ProductType
  userId?: User["id"]
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}> = ({ product, userId, onEdit, onDelete }) => {
  const t = useTranslation();
  const { query } = useRouter();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  return (
    <>
      <Box sx={{ position: "relative" }}>
        <Link
          href={{
            href: product.id,
            query: { ...query, products: [product.id] }
          }}
          passHref
          shallow
        >
          <Card
            component={Button}
            title={`${t("PRODUCT_label")} ${product.title}`}
            color="inherit"
            variant="outlined"
            sx={{
              backgroundColor: product.isAvailable
                ? undefined
                : "background.paper",
              display: "flex",
              justifyContent: "flex-start",
              height: "100%"
            }}
          >
            {product.imgSrc && (
              <CardMedia
                component="img"
                height={100}
                sx={{
                  width: 100,
                  height: 100,
                  overflow: "hidden",
                  objectFit: "cover",
                  flexShrink: 0
                }}
                src={product.imgSrc}
              />
            )}
            {!product.imgSrc && (
              <Box
                component="span"
                sx={{
                  width: 100,
                  height: 100,
                  overflow: "hidden",
                  objectFit: "cover",
                  bgcolor: "secondary.light",
                  flexShrink: 0
                }}
              />
            )}
            <CardContent component="span">
              {product.title && (
                <Typography variant="h3">{product.title}</Typography>
              )}
              {product.description && (
                <Typography variant="body2" sx={{ pt: 0.5 }}>
                  {product.description}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Link>
        {userId === product.owner.id && (
          <Box sx={{ position: "absolute", right: 0, top: 0 }}>
            <ProductMenu
              productId={product.id}
              onEdit={onEdit}
              onDelete={() => {
                setOpenDeleteModal(true);
              }}
            />
          </Box>
        )}
      </Box>
      <Modal
        open={openDeleteModal}
        onClose={() => {
          setOpenDeleteModal(false);
        }}
        aria-labelledby="delete-title"
        aria-describedby="delete-description"
      >
        <CondensedContainer
          sx={{
            ...modalStyle
          }}
        >
          <h3 id="delete-title">{`${t("DELETE_title")} ${product.title}`}</h3>
          <p id="delete-description">{t("DELETE_text")}</p>
          <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: "1fr 1fr" }}>
            <Button
              onClick={() => {
                setOpenDeleteModal(false);
              }}
              variant="text"
            >
              {t("DELETE_cancel_button")}
            </Button>
            <Button
              onClick={() => {
                setOpenDeleteModal(false);
                onDelete(product.id);
              }}
              variant="contained"
            >
              {t("DELETE_confirm_button")}
            </Button>
          </Box>
        </CondensedContainer>
      </Modal>
    </>
  );
};
