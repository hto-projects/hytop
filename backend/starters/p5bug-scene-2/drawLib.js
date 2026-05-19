function drawTree(startX, startY, treeHeight) {
  stroke("black");
  fill("brown")
  const trunkWidth = treeHeight / 4;
  const leafLeft = startX-10;
  const leafMiddle = (2* startX + trunkWidth) / 2;
  const leafRight = startX+trunkWidth+10;
  rect(startX, startY, trunkWidth, trunkWidth);

  fill("green");
  triangle(leafLeft, startY, leafMiddle, startY - (2/4)*treeHeight, leafRight, startY);
  triangle(leafLeft, startY - (1/7)*treeHeight, leafMiddle, startY - (2/4)*treeHeight, leafRight, startY - (1/7)*treeHeight);
  triangle(leafLeft, startY - (3/9)*treeHeight, leafMiddle, startY - (3/4)*treeHeight, leafRight, startY - (3/9)*treeHeight);
}

function drawCloud(startX, startY, size) {
  noStroke();
  fill("white");
  ellipse(startX, startY, size * (2/3), size * (2/3));
  ellipse(startX + size / 2, startY - size * (1/8), size, size);
  ellipse(startX + size, startY, size * (2/3), size * (2/3));
}
