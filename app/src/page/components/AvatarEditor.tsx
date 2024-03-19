import AvatarEditor from "react-avatar-editor";
import { Button, Image, Modal } from "react-bootstrap";
import { useRef } from "react";

function Is1abAvatarEditor(props: {
    show: boolean,
    handleHide: () => void
    setAvatar: (value: string | undefined) => void
    avatarFile: File | null | undefined
    onSubmit: () => Promise<void>
}){
    const editor = useRef<AvatarEditor | null>(null);
    const avatarFile = props.avatarFile;
    const show = props.show;
    const handleHide = props.handleHide;
    const setAvatar = props.setAvatar
    const onSubmit = props.onSubmit;

    const onSave = async () => {
        const dataUrl = editor.current?.getImage().toDataURL("image/png");
        setAvatar(dataUrl);
        onSubmit().then(() => {
            handleHide();
        })
    }

    return <Modal show={show} onHide={handleHide}>
        <Modal.Header>
            <h4 className="m-0 mx-auto">圖片裁切</h4>
        </Modal.Header>
        <Modal.Body className="d-flex justify-content-center">
            <div className="w-fit-content">
                <AvatarEditor
                    width={256}
                    height={256}
                    ref={editor}
                    image={avatarFile ?? ""}
                    border={0}
                    borderRadius={256}
                    color={[0, 0, 0, 0.6]} // RGBA
                    scale={1}
                    rotate={0}
                    backgroundColor="white"
                >
                </AvatarEditor>
            </div>
        </Modal.Body>
        <Modal.Footer>
            <Button className="w-100" variant="success" onClick={() => onSave()}>完成</Button>
            <Button className="w-100" variant="danger" onClick={() => handleHide()}>取消</Button>
        </Modal.Footer>
    </Modal>
}

export default Is1abAvatarEditor;