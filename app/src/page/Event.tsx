import { Container } from "react-bootstrap";
import { Calendar } from "rsuite";
function Event(){
    return (
        <Container className="p-5 text-center">
            <h2 className="pb-4"> 近期活動 </h2>
            <Calendar bordered className="shadow rounded"></Calendar>
        </Container>
    )
}

export default Event;