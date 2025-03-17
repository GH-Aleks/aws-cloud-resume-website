import unittest
from unittest.mock import patch, MagicMock
from func import lambda_handler

class TestLambdaHandler(unittest.TestCase):

    @patch("func.table")
    def test_lambda_handler_success(self, mock_table):
        # Mock DynamoDB get_item response
        mock_table.get_item.return_value = {
            "Item": {"id": "1", "views": 10}
        }
        # Mock DynamoDB put_item response
        mock_table.put_item.return_value = {}

        # Simulate Lambda event and context
        event = {}
        context = {}

        # Call the function
        result = lambda_handler(event, context)

        # Assertions
        self.assertEqual(result, 11)
        mock_table.get_item.assert_called_once_with(Key={"id": "1"})
        mock_table.put_item.assert_called_once_with(Item={"id": "1", "views": 11})

    @patch("func.table")
    def test_lambda_handler_no_item(self, mock_table):
        # Mock DynamoDB get_item response with no item
        mock_table.get_item.return_value = {}

        # Simulate Lambda event and context
        event = {}
        context = {}

        # Call the function and expect an exception
        with self.assertRaises(KeyError):
            lambda_handler(event, context)

if __name__ == "__main__":
    unittest.main()