import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import CustomerCreatedEvent from "../customer-created.event";
import CustomerAddressChangeEvent from "../customer-address-change.event";

export default class EnviaConsoleLogHandler
    implements EventHandlerInterface<CustomerAddressChangeEvent> {
    handle(event: CustomerAddressChangeEvent): void {
        console.log(`Endereço do cliente: ${event.eventData.id}, ${event.eventData.nome} alterado para: ${event.eventData.Address}`);
    }
}
