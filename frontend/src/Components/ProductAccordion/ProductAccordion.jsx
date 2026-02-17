import { Accordion } from '@mantine/core';

const ProductAccordion = ({ material, description }) => {
    return (
        <Accordion multiple>
            <Accordion.Item value="description">
                <Accordion.Control tt={"uppercase"}>Description</Accordion.Control>
                <Accordion.Panel>
                    {description}
                </Accordion.Panel>
            </Accordion.Item>
            <Accordion.Item value="materials">
                <Accordion.Control tt={"uppercase"}>Material</Accordion.Control>
                <Accordion.Panel>
                    {material}
                </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value="shipping">
                <Accordion.Control tt={"uppercase"}>Shipping & Delivery</Accordion.Control>
                <Accordion.Panel>
                    Delivered within 3-5 business days
                </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value="returns">
                <Accordion.Control tt={"uppercase"}>Returns</Accordion.Control>
                <Accordion.Panel>
                    7-day easy return policy
                </Accordion.Panel>
            </Accordion.Item>
        </Accordion>
    );
}

export default ProductAccordion;