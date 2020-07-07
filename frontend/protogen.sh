#!/bin/bash

echo "Compiling protobuf definitions"

OUT_DIR="./src/_proto"
PROTOC_GEN_TS_PATH="./node_modules/.bin/protoc-gen-ts"

mkdir -p ${OUT_DIR}

echo "Compile CloudState protobuf definitions"
protoc \
    --proto_path="node_modules/cloudstate/proto" \
    --plugin="protoc-gen-ts=${PROTOC_GEN_TS_PATH}" \
    --js_out="import_style=commonjs,binary:${OUT_DIR}" \
    --ts_out="${OUT_DIR}" \
    node_modules/cloudstate/proto/google/api/httpbody.proto \
    node_modules/cloudstate/proto/google/api/http.proto \
    node_modules/cloudstate/proto/google/api/annotations.proto \
    node_modules/cloudstate/proto/cloudstate/entity_key.proto \
    node_modules/cloudstate/proto/cloudstate/eventing.proto

echo "Compile Shopping Cart Service"
protoc \
    --proto_path=. \
    --plugin="protoc-gen-ts=${PROTOC_GEN_TS_PATH}" \
    --js_out="import_style=commonjs,binary:${OUT_DIR}" \
    --ts_out="service=grpc-web:${OUT_DIR}" \
    -I node_modules/cloudstate/proto/ \
    shoppingcart.proto

