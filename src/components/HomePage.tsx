import * as React from "react";
import Cards from "@cloudscape-design/components/cards";
import Box from "@cloudscape-design/components/box";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Button from "@cloudscape-design/components/button";
import TextFilter from "@cloudscape-design/components/text-filter";
import Header from "@cloudscape-design/components/header";
import Pagination from "@cloudscape-design/components/pagination";
import CollectionPreferences from "@cloudscape-design/components/collection-preferences";
import { Link } from "react-router-dom"

function HomePage(){
  const [
    selectedItems,
    setSelectedItems
  ] = React.useState([{ name: "Item 2" }]);
  return (
    <Cards
      onSelectionChange={({ detail }) =>
        setSelectedItems(detail?.selectedItems ?? [])
      }
      ariaLabels={{
        itemSelectionLabel: (e, i) => `select ${i.name}`,
        selectionGroupLabel: "Item selection"
      }}
      cardDefinition={{
        header: item => (
          <Link to="../uploadImages">
            {item.name}
          </Link>
        ),
        sections: [
          {
            id: "description",
            header: "Description",
            content: item => item.description
          }
        ]
      }}
      cardsPerRow={[
        { cards: 1 },
        { minWidth: 500, cards: 2 }
      ]}
      items={[
        {
          name: "Fly Climbing Assay Automator",
          alt: "uploadImages",
          description: "Climbing assay tool"
        },
      ]}
      loadingText="Loading resources"
      selectionType="multi"
      trackBy="name"
      visibleSections={["description"]}
    />
  );
}

export default HomePage;