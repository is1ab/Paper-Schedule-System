import { Container } from "react-bootstrap";
import { Calendar } from "rsuite";
function Event(){
    return (
        <Container className="p-5 text-center">
            <h2> 近期活動 </h2>
            <Calendar>
                
            </Calendar>
        </Container>
    )
}

export default Event;