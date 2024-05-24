import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../Layouts/Layout';
import { fetchTransactionByIdThunk } from '../redux/transactionSlice';
import { RootState } from '../redux/store';
import { AppDispatch } from '../redux/store';

const TransactionDetailPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { transactionId } = useParams<{ transactionId: string }>();
  const { transaction, status, error } = useSelector(
    (state: RootState) => state.transaction
  );

  useEffect(() => {
    if (transactionId) {
      dispatch(fetchTransactionByIdThunk(transactionId));
    }
  }, [dispatch, transactionId]);

  if (status === 'loading') {
    return <div>Loading transaction details...</div>;
  }
  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }
  return (
    <Layout backgroundColor="bg-[#dfe6ed]">
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-start p-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-secondary transition-colors duration-200 hover:text-[#00A96B]"
          >
            <span className="text-lg font-medium">Retour</span>
          </button>
        </div>
        <h1 className="mb-4 text-2xl font-bold">Transaction Details</h1>
        {transaction && (
          <div className="rounded-lg bg-white p-4 shadow-md">
            <p className="text-lg font-medium">
              Description: {transaction.description}
            </p>
            <p className="text-sm text-gray-500">Date: {transaction.date}</p>
            <p className="text-sm text-gray-500">
              Amount: {transaction.amount}
            </p>
            <p className="text-sm text-gray-500">
              Balance: {transaction.balance}
            </p>
            <p className="text-sm text-gray-500">Type: {transaction.type}</p>
            <p className="text-sm text-gray-500">
              Category: {transaction.category}
            </p>
            <p className="text-sm text-gray-500">Notes: {transaction.notes}</p>
            <p className="text-sm text-gray-500">
              Merchant: {transaction.merchant}
            </p>
            <p className="text-sm text-gray-500">
              Location: {transaction.location}
            </p>
            <p className="text-sm text-gray-500">
              Status: {transaction.status}
            </p>
            <p className="text-sm text-gray-500">
              Currency: {transaction.currency}
            </p>
            <p className="text-sm text-gray-500">
              Payment Method: {transaction.paymentMethod}
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};
export default TransactionDetailPage;
