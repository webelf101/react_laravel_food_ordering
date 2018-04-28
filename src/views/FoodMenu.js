import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import Axios from 'axios';

import Text from '../components/Text';
import PhotosSlider from '../components/PhotosSlider';
import FoodItem from '../components/FoodItem';
import Space from '../components/Space';
import FoodItemForm from '../components/FoodItemForm';

import { FontTypes } from '../base/Fonts';
import Colors from '../base/Colors';
import Spacing from '../base/Spacing';

import Urls from '../Urls';
import Button from '../components/Button';
import SpaceBetween from '../components/SpaceBetween';
import keyGenerator from '../KeyGenerator';
import PhotoExplorer from '../components/PhotoExplorer';

const itemWidth = '32.6%';

const FoodMenuContainer = styled.div`
  width: 100%;
  padding: ${Spacing.get('4x')} ${Spacing.get('10x')};
  margin-bottom: ${Spacing.get('4x')};
`;

const FoodMenuGrid = styled.div`
  display: grid;
  grid-template-columns: ${itemWidth} ${itemWidth} ${itemWidth};
  grid-column-gap: 1%;
  grid-row-gap: ${Spacing.get('4x')};
`;

const FoodItemContainer = styled.div`
  border-radius: 4px;
  height: max-content;
  overflow: hidden;
`;

class FoodMenu extends Component {
  constructor(props) {
    super(props);

    document.body.style.background = Colors.white;
  }

  state = { foodItems: new Map() };

  componentDidMount() {
    Axios.get(`${Urls.search}?query=`).then(response => {
      const foodItems = new Map();
      response.data.data.map(item => foodItems.set(item.id, item));

      this.setState({
        foodItems,
      });
    });
  }

  onItemSave = item => {
    this.setState(prevState => {
      const newItems = prevState.foodItems;
      newItems.set(item.id, item);

      return {
        foodItems: newItems,
      };
    });
  };

  render() {
    const { foodItems } = this.state;

    return (
      <Fragment>
        <FoodMenuContainer>
          <Space display="block" height={Spacing.get('6x')} />
          <SpaceBetween>
            <div>
              <Text type={FontTypes.BigTitle}>Food Menu</Text>
              <Space display="block" height={Spacing.get('2x')} />
              <Text type={FontTypes.Heading} color={Colors.grey}>
                Control the food menu
              </Text>
            </div>
            <Button onClick={() => this.modal.showModal({})}>Add an item</Button>
          </SpaceBetween>

          <Space display="block" height={Spacing.get('10x')} />

          <FoodMenuGrid>
            {Array.from(foodItems.values()).map(item => (
              <FoodItemContainer key={keyGenerator('menu')}>
                <PhotosSlider photos={item.photos} />
                <Space display="block" height={Spacing.get('2x')} />
                <FoodItem
                  showAddToCartButton={false}
                  onFoodNameClick={this.modal.showModal}
                  shouldTrimDesc="true"
                  {...item}
                />
              </FoodItemContainer>
            ))}
          </FoodMenuGrid>
        </FoodMenuContainer>

        <PhotoExplorer
          ref={photoInput => {
            this.photoInput = photoInput;
          }}
        />

        <FoodItemForm
          photoExplorerRef={this.photoInput}
          onItemSave={this.onItemSave}
          ref={modal => {
            this.modal = modal;
          }}
        />
      </Fragment>
    );
  }
}

export default FoodMenu;
