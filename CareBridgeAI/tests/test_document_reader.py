import unittest
import io
from PIL import Image
from modules.document_reader import (
    validate_uploaded_file,
    extract_text_from_pdf,
    extract_text_from_image,
    preprocess_handwritten_image,
    MAX_FILE_SIZE_MB
)

class DummyUpload:
    def __init__(self, name, size):
        self.name = name
        self.size = size

class TestDocumentReader(unittest.TestCase):

    def test_file_validation_valid_pdf(self):
        file = DummyUpload("discharge_note.pdf", 1024 * 500) # 500 KB
        is_valid, msg = validate_uploaded_file(file)
        self.assertTrue(is_valid)

    def test_file_validation_invalid_type(self):
        file = DummyUpload("virus.exe", 1024)
        is_valid, msg = validate_uploaded_file(file)
        self.assertFalse(is_valid)
        self.assertIn("Unsupported file type", msg)

    def test_file_validation_oversized(self):
        file = DummyUpload("huge_file.pdf", (MAX_FILE_SIZE_MB + 5) * 1024 * 1024)
        is_valid, msg = validate_uploaded_file(file)
        self.assertFalse(is_valid)
        self.assertIn("too large", msg)

    def test_empty_pdf_handling(self):
        text, success, msg = extract_text_from_pdf(b"")
        self.assertFalse(success)
        self.assertIn("Error", msg)

    def test_unreadable_image_handling(self):
        text, success, msg = extract_text_from_image(b"not-an-image")
        self.assertFalse(success)
        self.assertIn("Invalid or unreadable image", msg)

    def test_preprocess_handwritten_image(self):
        # Create a small valid test image in memory
        img = Image.new("RGB", (100, 100), color="white")
        buf = io.BytesIO()
        img.save(buf, format="JPEG")
        raw_bytes = buf.getvalue()
        
        enhanced = preprocess_handwritten_image(raw_bytes)
        self.assertIsInstance(enhanced, bytes)
        self.assertGreater(len(enhanced), 0)

if __name__ == "__main__":
    unittest.main()
