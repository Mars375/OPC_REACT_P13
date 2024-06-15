import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../Layouts/Layout';
import {
  fetchTransactionByIdThunk,
  updateTransactionThunk,
  deleteTransactionThunk,
} from '../redux/transactionSlice';
import { RootState } from '../redux/store';
import { AppDispatch } from '../redux/store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

/**
 * TransactionDetailPage component displays the details of a specific transaction.
 * It allows the user to edit the transaction details and handles various states such as loading and error.
 *
 * @component
 * @example
 * return (
 *   <TransactionDetailPage />
 * )
 */
const TransactionDetailPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { transactionId } = useParams<{ transactionId: string }>();
  const { transaction, status, error } = useSelector(
    (state: RootState) => state.transaction
  );

  // State variables for edit mode and transaction fields
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [notes, setNotes] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Fetch transaction details if transactionId is available
  useEffect(() => {
    if (transactionId) {
      dispatch(fetchTransactionByIdThunk(transactionId));
    }
  }, [dispatch, transactionId]);

  // Update state variables when transaction details are loaded
  useEffect(() => {
    if (transaction) {
      setDescription(transaction.description);
      setCategory(transaction.category);
      setNotes(transaction.notes);
    }
  }, [transaction]);

  // Handle save button click
  const handleSave = () => {
    if (transaction) {
      dispatch(
        updateTransactionThunk({
          accountId: transaction.accountId,
          transactionId: transaction.transactionId,
          updates: { description, category, notes },
        })
      );
      setIsEditing(false);
    }
  };

  // Handle delete button click
  const handleDelete = () => {
    if (transaction) {
      setShowDeleteConfirm(true);
    }
  };

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    if (transaction) {
      dispatch(
        deleteTransactionThunk({
          accountId: transaction.accountId,
          transactionId: transaction.transactionId,
        })
      ).then(() => {
        navigate(-1); // Navigate back after deletion
      });
      setShowDeleteConfirm(false);
    }
  };

  // Display error message if transaction fetch fails
  if (status === 'failed') {
    return (
      <div
        className="mb-4 flex items-center justify-center rounded-lg bg-red-100 p-4 text-sm text-red-700"
        role="alert"
      >
        <FontAwesomeIcon
          icon="exclamation-circle"
          className="mr-3 inline h-5 w-5"
        />
        <span className="font-medium">{error}</span>
      </div>
    );
  }

  return (
    <Layout backgroundColor="bg-[#dfe6ed]">
      <>
        {status === 'loading' ? (
          <div className="absolute left-0 top-0 z-50 flex h-full w-full items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid  border-current border-e-transparent align-[-0.125em] text-secondary motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-start p-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center text-secondary transition-colors duration-200 hover:text-[#00A96B]"
              >
                <FontAwesomeIcon icon="arrow-left" className="mr-2" />
                <span className="text-lg font-medium">Retour</span>
              </button>
            </div>
            <div className="container mx-auto p-4">
              <div className="mb-4 flex items-center justify-between">
                {isEditing ? (
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border-b-2 border-[#00A96B] bg-[#dfe6ed] p-2 text-2xl font-bold outline-none"
                    placeholder="Description"
                  />
                ) : (
                  <h1 className="text-2xl font-bold">
                    {transaction?.description}
                  </h1>
                )}
                <div className="flex items-center">
                  <FontAwesomeIcon
                    icon={faEdit}
                    className="ml-4 cursor-pointer text-gray-500"
                    onClick={() => setIsEditing(!isEditing)}
                  />
                  <FontAwesomeIcon
                    icon={faTrash}
                    className="ml-4 cursor-pointer text-red-500"
                    onClick={handleDelete}
                  />
                </div>
              </div>
              {transaction && (
                <div className="rounded-lg bg-white p-6 shadow-md">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="flex items-center">
                      <FontAwesomeIcon
                        icon="calendar-alt"
                        className="mr-2 text-gray-500"
                      />
                      <p className="text-lg font-medium">
                        Date: {transaction.date}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <FontAwesomeIcon
                        icon="dollar-sign"
                        className="mr-2 text-gray-500"
                      />
                      <p className="text-lg font-medium">
                        Amount: {transaction.amount}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <FontAwesomeIcon
                        icon="tag"
                        className="mr-2 text-gray-500"
                      />
                      {isEditing ? (
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full rounded border p-2 outline-none"
                        >
                          <option value="Food">Food</option>
                          <option value="Groceries">Groceries</option>
                          <option value="Transport">Transport</option>
                          <option value="Entertainment">Entertainment</option>
                          <option value="Shopping">Shopping</option>
                          <option value="Health">Health</option>
                          <option value="Other">Other</option>
                        </select>
                      ) : (
                        <p className="text-lg font-medium">
                          Category: {transaction.category}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center">
                      <FontAwesomeIcon
                        icon="store"
                        className="mr-2 text-gray-500"
                      />
                      <p className="text-lg font-medium">
                        Merchant: {transaction.merchant}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <FontAwesomeIcon
                        icon="map-marker-alt"
                        className="mr-2 text-gray-500"
                      />
                      <p className="text-lg font-medium">
                        Location: {transaction.location}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <FontAwesomeIcon
                        icon="info-circle"
                        className="mr-2 text-gray-500"
                      />
                      {isEditing ? (
                        <textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          className="w-full rounded border p-2 outline-none"
                          placeholder="Notes"
                        />
                      ) : (
                        <p className="text-lg font-medium">
                          Notes: {transaction.notes}
                        </p>
                      )}
                    </div>
                  </div>
                  {isEditing && (
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={handleSave}
                        className="mr-2 rounded bg-secondary px-4 py-2 text-white transition-colors duration-200 hover:bg-[#00A96B]"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="rounded bg-gray-500 px-4 py-2 text-white transition-colors duration-200 hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="rounded bg-white p-6 shadow-lg">
              <h2 className="mb-4 text-lg font-bold">Confirm Deletion</h2>
              <p className="mb-4">
                Are you sure you want to delete this transaction?
              </p>
              <div className="flex justify-end">
                <button
                  onClick={handleDeleteConfirm}
                  className="mr-2 rounded bg-red-500 px-4 py-2 text-white transition-colors duration-200 hover:bg-red-600"
                >
                  Delete
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="rounded bg-gray-500 px-4 py-2 text-white transition-colors duration-200 hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    </Layout>
  );
};

export default TransactionDetailPage;
