import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../Layouts/Layout';
import {
  fetchTransactionByIdThunk,
  updateTransactionThunk,
} from '../redux/transactionSlice';
import { RootState } from '../redux/store';
import { AppDispatch } from '../redux/store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

const TransactionDetailPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { transactionId } = useParams<{ transactionId: string }>();
  const { transaction, status, error } = useSelector(
    (state: RootState) => state.transaction
  );

  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (transactionId) {
      dispatch(fetchTransactionByIdThunk(transactionId));
    }
  }, [dispatch, transactionId]);

  useEffect(() => {
    if (transaction) {
      setDescription(transaction.description);
      setCategory(transaction.category);
      setNotes(transaction.notes);
    }
  }, [transaction]);

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
                <FontAwesomeIcon
                  icon={faEdit}
                  className="ml-4 cursor-pointer text-gray-500"
                  onClick={() => setIsEditing(!isEditing)}
                />
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
                        <input
                          type="text"
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full rounded border p-2 outline-none"
                          placeholder="Category"
                        />
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
                      <p className="text-lg font-medium">
                        Status: {transaction.status}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <FontAwesomeIcon
                        icon="money-bill-wave"
                        className="mr-2 text-gray-500"
                      />
                      <p className="text-lg font-medium">
                        Currency: {transaction.currency}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <FontAwesomeIcon
                        icon="credit-card"
                        className="mr-2 text-gray-500"
                      />
                      <p className="text-lg font-medium">
                        Payment Method: {transaction.paymentMethod}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-lg font-medium">
                      <FontAwesomeIcon
                        icon="sticky-note"
                        className="mr-2 text-gray-500"
                      />
                      Notes: {transaction.notes}
                    </p>
                    {isEditing && (
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full rounded border p-2 outline-none"
                        placeholder="Notes"
                      />
                    )}
                  </div>
                  <div className="mt-4 flex justify-end">
                    {isEditing && (
                      <button
                        onClick={handleSave}
                        className="rounded bg-blue-500 px-4 py-2 text-white transition-colors duration-200 hover:bg-blue-700"
                      >
                        Save
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </>
    </Layout>
  );
};

export default TransactionDetailPage;
